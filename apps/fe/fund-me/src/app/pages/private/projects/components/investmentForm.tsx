import React, { useEffect, useMemo, useState } from 'react';
import {
    GetProjectDocument,
    Project,
    UpdateInvestmentStatusDocument,
    useCreateInvestmentMutation,
    useUpdateInvestmentStatusMutation
} from '../../../../../generated/graphql';
import { useEthereumAddress } from '../../hooks/useEthereumAddress';
import { ethers } from 'ethers';
import { Button, Grid, TextField } from '@mui/material';
import styled from 'styled-components';
import { calculatePrecision, convertToFloat } from '../../util';

const InputBoxWrapper = styled.div`
    display: flex;
`;

const InvestmentForm: React.FC<{ project: Project }> = ({ project }) => {
    const walletAddress = useEthereumAddress();
    const [loading, setLoading] = useState<boolean>(false);
    const [amount, setAmount] = useState(convertToFloat(project.minInvestment, project.minInvestmentPrecision));

    const minAmount = useMemo(() => convertToFloat(project.minInvestment, project.minInvestmentPrecision), [project]);

    const [createInvestment, { data: investmentData, loading: createLoading, error }] = useCreateInvestmentMutation({
        refetchQueries: [{ query: GetProjectDocument, variables: { id: project.id } }],
    });

    const [updateInvestmentStatus] = useUpdateInvestmentStatusMutation({
        refetchQueries: [{ query: GetProjectDocument, variables: {id: project.id}}]
    });

    const createInvestmentFn = async (txHash: string): Promise<string> => {
        const { amount: amountInt, precision } = calculatePrecision(parseFloat(amount.toString()));

        const { data } = await createInvestment({
            variables: {
                projectId: project.id,
                amount: amountInt,
                ethAddress: walletAddress,
                precision,
                status: "pending",
                txHash: txHash
            },
        });

        return data!.createInvestment!.id;
    };

    const updateInvestmentStatusFn = async (investmentId: string, status: string, txHash: string) => {
        await updateInvestmentStatus({
            variables: {
                investmentId,
                status,
                txHash,
            },
        });
    };

    const sendEthTransaction = async (investmentId: string) => {

        try {
            setLoading(true);
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            console.log('Attempting to send transaction...');
            const tx = await signer.sendTransaction({
                to: project.ethAddress,
                value: ethers.parseEther(amount.toString()),
            });

            console.log('Transaction sent, tx hash:', tx.hash);

            // Immediately update the status to 'pending' with the transaction hash
            await updateInvestmentStatusFn(investmentId, 'pending', tx.hash);

            // Wait for the transaction to be mined
            console.log('Waiting for transaction to be mined...');
            const receipt = await tx.wait();

            console.log('Transaction mined, receipt:', receipt);

            // Update investment status to 'approved'
            await updateInvestmentStatusFn(investmentId, 'approved', tx.hash);

            alert('Transaction successful and registered on the backend');
        } catch (error) {
            console.error('Transaction failed:', error);

            // Update investment status to 'failed'
            if (investmentId) {
                await updateInvestmentStatusFn(investmentId, 'failed', '');
            }
            alert('Transaction failed');
        } finally {
            setLoading(false);
        }
    };


    const handleInvest = async () => {
        try {
            if (minAmount > amount) {
                alert('The amount is lower than the minimal amount');
                return;
            }

            if (!walletAddress) {
                alert('Please connect your wallet');
                return;
            }
            const investmentId = await createInvestmentFn('');
            await sendEthTransaction(investmentId);
        } catch (err) {
            console.error('Error creating investment:', err);
        }
    };

    if (createLoading) return <p>Loading investment...</p>;
    if (loading) return <p>Loading blockchain transaction...</p>;

    return (
        <div>
            {error && <p>An error occurred: {error.message}</p>}
            <InputBoxWrapper>
                <TextField
                    fullWidth
                    label="Invest into project"
                    name="investAmount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    margin="normal"
                />
                <Button color="primary" onClick={handleInvest}>
                    Invest
                </Button>
            </InputBoxWrapper>
        </div>
    );
};

export default InvestmentForm;

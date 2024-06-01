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

            // Construct the transaction
            const tx = {
                to: project.ethAddress,
                value: ethers.parseEther(amount.toString()),
            };

            // Send the transaction and get the transaction hash immediately
            const txHash = await signer.sendUncheckedTransaction(tx);

            // Immediately update the status to 'pending' with the transaction hash
            await updateInvestmentStatusFn(investmentId, 'pending', txHash);

            // Wait for the transaction to be mined
            await provider.once(txHash, async (receipt) => {
                if (receipt.status === 1) {
                    // Update investment status to 'approved' if the transaction is mined successfully
                    await updateInvestmentStatusFn(investmentId, 'approved', txHash);
                    alert('Transaction successful and registered on the backend');
                } else {
                    // Update investment status to 'failed' if the transaction failed
                    await updateInvestmentStatusFn(investmentId, 'failed', txHash);
                    alert('Transaction failed');
                }
            });

        } catch (error) {
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

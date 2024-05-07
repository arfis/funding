import React, {useContext, useState} from 'react';
import { useMutation } from '@apollo/client';
import {GetProjectDocument, Mutation, useCreateInvestmentMutation} from '../../../../../generated/graphql';
import {UserContext} from '../../dashboard/dashboard-page';

function InvestmentForm({ projectId }: {projectId: string}) {
    const user = useContext(UserContext)
    const [amount, setAmount] = useState('');
    const [createInvestment, {data, loading, error }] = useCreateInvestmentMutation({
        refetchQueries: [
            {query: GetProjectDocument, variables: { id: projectId }},
        ]
    });

    const handleInvest = async () => {
        try {
            const { data } = await createInvestment({
                variables: {
                    projectId,
                    amount: parseFloat(amount),
                },
            });
        } catch (err) {
            console.error("Error creating investment:", err);
        }
    };

    if (loading) return <p>Loading...</p>;


    return (
        <div>
            {error && <p>An error occurred: {error.message}</p>}
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount to invest"
            />
            <button onClick={handleInvest}>Invest</button>
        </div>
    );
}

export default InvestmentForm;

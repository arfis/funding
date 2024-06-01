import React from 'react';
import {
    GetProjectDocument,
    Investment,
    useCreateInvestmentMutation,
    useGetProjectInvestmentsQuery, useGetQuizByTypeQuery
} from '../../../../../generated/graphql';
import { convertToFloat } from '../../util';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Link,
    Box
} from '@mui/material';

const ethScanner = "https://sepolia.etherscan.io/tx/";

const SimpleInvestmentList: React.FC<{ projectId: string }> = ({ projectId }) => {

    const {loading, error, data} = useGetProjectInvestmentsQuery({variables: {id: projectId}});

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><Typography variant="h6">Name</Typography></TableCell>
                        <TableCell><Typography variant="h6">Investment Date</Typography></TableCell>
                        <TableCell><Typography variant="h6">Amount</Typography></TableCell>
                        <TableCell><Typography variant="h6">Status</Typography></TableCell>
                        <TableCell><Typography variant="h6">Transaction Hash</Typography></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?.getProjectInvestments.map((investment) => (
                        <TableRow key={investment.id}>
                            <TableCell>{investment.userName}</TableCell>
                            <TableCell>{new Date(investment!.createdAt).toLocaleString()}</TableCell>
                            <TableCell>{convertToFloat(investment.amount, investment.precision)}</TableCell>
                            <TableCell>{investment.status}</TableCell>
                            <TableCell>
                                <Link href={`${ethScanner}/${investment.txHash}`} target="_blank" rel="noopener noreferrer">
                                    {investment.txHash}
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default SimpleInvestmentList;

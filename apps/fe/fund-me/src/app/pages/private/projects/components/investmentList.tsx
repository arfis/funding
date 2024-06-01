import React from 'react';
import { Investment } from '../../../../../generated/graphql';
import { convertToFloat } from '../../util';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import styled from 'styled-components';

const StyledCard = styled(Card)`
    margin: 16px 0;
    padding: 16px;
`;

const InvestmentList: React.FC<{ investments: Investment[] }> = ({ investments }) => {
    const ethScanner = "https://sepolia.etherscan.io/tx/" // "https://etherscan.io/tx/0xeef10fc5170f669b86c4cd0444882a96087221325f8bf2f55d6188633aa7be7c"
    return (
        <Box>
            {investments.map((investment) => (
                <StyledCard key={investment.id}>
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h6">
                                    Investment Date: {new Date(investment.createdAt).toLocaleString()}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1">
                                    Amount: {convertToFloat(investment.amount, investment.precision)}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1">
                                    Status: {investment.status}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2" color="textSecondary">
                                    Transaction Hash: <a href={ `${ethScanner}/${investment.txHash}`} target="_blank"> {investment.txHash}</a>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </StyledCard>
            ))}
        </Box>
    );
};

export default InvestmentList;

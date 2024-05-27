import React from 'react';
import {Container, Grid, Box, Typography, Button, LinearProgress, Avatar, CircularProgress} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InvestmentForm from './components/investmentForm';
import {useGetProjectQuery} from '../../../../generated/graphql';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import {HEADER_HEIGHT} from '../../../constants';
// Adjust the import path as necessary

const ProjectList = styled.div`
    height: calc(100vh - ${HEADER_HEIGHT});
    overflow: auto;
    margin: 20px 0;
`;

const ProjectDetailPage = () => {
    const {id} = useParams<{ id: string }>();
    // const user = useContext(UserContext)
    const {loading, error, data} = useGetProjectQuery({variables: {id: id || ''}});

    if (loading) return <CircularProgress/>;
    if (error) return <Typography color="error">Error: {error.message}</Typography>;

    const project = data?.getProject as any;

    if (!project) {
        return <Typography color="error">Project not found</Typography>;
    }

    return (
        <ProjectList>
            <Container maxWidth="lg">
                <Box p={3} bgcolor="primary.main" color="white" borderRadius={2} mb={4}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={8}>
                            <Box display="flex" alignItems="center">
                                <Avatar src={project.imageUrl} alt={project.name} sx={{width: 64, height: 64, mr: 2}}/>
                                <Box>
                                    <Typography variant="h4">{project.name}</Typography>
                                    <Typography variant="subtitle1">{project.description}</Typography>
                                </Box>
                            </Box>
                            <Box mt={3}>
                                <Typography variant="h6">Deal fundraising</Typography>
                                <LinearProgress variant="determinate"
                                                value={(project.allocation as number / (project.freeAllocation as number)) * 100}/>
                                <Typography variant="subtitle1">
                                    {project.freeAllocation} / {project.allocation} USDC
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Project Category</Typography>
                                    <Typography variant="body1">{project.category}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Round</Typography>
                                    <Typography variant="body1">{project.round}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Valuation</Typography>
                                    <Typography variant="body1">{project.valuation}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Total raising amount</Typography>
                                    <Typography variant="body1">{project.allocation}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Syndicate raising amount</Typography>
                                    <Typography variant="body1">{project.syndicateRaisingAmount}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Leading investor</Typography>
                                    <Typography variant="body1">{project.leadingInvestor}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box display="flex" alignItems="center" bgcolor="secondary.main" p={2} borderRadius={2}>
                            <CalendarTodayIcon fontSize="large"/>
                            <Box ml={2}>
                                <Typography variant="subtitle2">Deal Date</Typography>
                                <Typography variant="body1">{project.endDate}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box display="flex" alignItems="center" bgcolor="secondary.main" p={2} borderRadius={2}>
                            <AttachMoneyIcon fontSize="large"/>
                            <Box ml={2}>
                                <Typography variant="subtitle2">Token Price</Typography>
                                <Typography variant="body1">{project.tokenPrice}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box display="flex" alignItems="center" bgcolor="secondary.main" p={2} borderRadius={2}>
                            <AccessTimeIcon fontSize="large"/>
                            <Box ml={2}>
                                <Typography variant="subtitle2">Vesting</Typography>
                                <Typography variant="body1">{project.vesting}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box display="flex" alignItems="center" bgcolor="secondary.main" p={2} borderRadius={2}>
                            <Typography variant="subtitle2">Allocation</Typography>
                            <Typography variant="body1">{project.allocation}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box display="flex" alignItems="center" bgcolor="secondary.main" p={2} borderRadius={2}>
                            <Typography variant="subtitle2">TGE</Typography>
                            <Typography variant="body1">{project.tge}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box display="flex" alignItems="center" bgcolor="secondary.main" p={2} borderRadius={2}>
                            <Typography variant="subtitle2">Claim</Typography>
                            <Typography variant="body1">{project.claim}</Typography>
                        </Box>
                    </Grid>
                </Grid>
                <Box mt={4}>
                    <Typography variant="h5">Description</Typography>
                    <Typography variant="body1">{project.longDescription}</Typography>
                </Box>
                <Box mt={4}>
                    <Typography variant="h5">Overview</Typography>
                    <Typography variant="body1">{project.overview}</Typography>
                </Box>
                <Box mt={4}>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Button variant="contained" color="primary" href={project.website}>Website</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" href={project.twitter}>Twitter</Button>
                        </Grid>
                    </Grid>
                </Box>
                <Box mt={4}>
                    <InvestmentForm projectId={project.id}/>
                </Box>
            </Container>
        </ProjectList>
    );
};

export default ProjectDetailPage;

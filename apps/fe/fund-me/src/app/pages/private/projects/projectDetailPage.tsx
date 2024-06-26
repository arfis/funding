import React, {useMemo} from 'react';
import {Container, Grid, Box, Typography, Button, LinearProgress, Avatar, CircularProgress} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InvestmentForm from './components/investmentForm';
import {useGetProjectQuery} from '../../../../generated/graphql';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import {HEADER_HEIGHT} from '../../../constants';
import {format} from 'date-fns';
import {convertToFloat} from '../util';
import AlocationProgress from '../components/AlocationProgress';
import InvestmentList from './components/investmentList';
import SimpleInvestmentList from './components/simpleInvestmentList';
// Adjust the import path as necessary

const ProjectList = styled.div`
    height: calc(100vh - ${HEADER_HEIGHT});
    overflow: auto;
    box-sizing: border-box;
    padding: 20px 0;
`;

const InvestBox = styled(Box)`
    bottom: 0;
    //position: sticky;
    /* background: gray; */
    border-radius: 10px;
    padding: 10px;
`

const MainItems = styled(Grid)`
    //position: sticky;
    /* background: gray; */
`

const DescriptionBox = styled(Box)`

`

const DescriptionTile = styled(Box)`

`

const ProjectDetailPage = () => {
    const {id} = useParams<{ id: string }>();
    const {loading, error, data} = useGetProjectQuery({variables: {id: id || ''}},);
    const project = data?.getProject;
    const formattedEndDate = useMemo(() => project?.endDate
        ? format(new Date(project!.endDate), 'MMMM d, yyyy')
        : format(new Date(), 'MMMM d, yyyy'), [project]);

    // const user = useContext(UserContext)

    if (loading) return <CircularProgress/>;
    if (error) return <Typography color="error">Error: {error.message}</Typography>;


    if (!project) {
        return <Typography color="error">Project not found</Typography>;
    }

    return (
        <ProjectList>
            <Container maxWidth="lg">
                <Box p={3} bgcolor="secondary.main" color="black" borderRadius={2} mb={4}>
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
                                <AlocationProgress freeAllocation={project.freeAllocation as number}
                                                   allocation={project.allocation as number}/>
                                <Typography variant="subtitle1">
                                    {project!.allocation - (project.freeAllocation || 0)} / {project.allocation} Eth
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Project Category</Typography>
                                    <Typography variant="body2">{project.category}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Round</Typography>
                                    <Typography variant="body2">{project.round}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Valuation</Typography>
                                    <Typography variant="body2">{project.valuation}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Total raising amount</Typography>
                                    <Typography variant="body2">{project.allocation}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Syndicate raising amount</Typography>
                                    <Typography variant="body2">{project.syndicateRaisingAmount}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2">Leading investor</Typography>
                                    <Typography variant="body2">{project.leadingInvestor}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>

                {project.hasPermissionToEdit && (
                    <Box>
                        <SimpleInvestmentList projectId={project.id}></SimpleInvestmentList>
                    </Box>)}

                <MainItems container p={5} bgcolor="background.default" color="black" borderRadius={2} mb={4}>
                    <Grid item xs={6} sm={8} md={8}>
                        <Box mt={4}>
                            <Box>
                                <Typography variant="h5">Description</Typography>
                                <Typography variant="body2">{project.longDescription}</Typography>
                            </Box>
                        </Box>
                        <Box mt={4}>
                            <Box>
                                <Typography variant="h5">Overview</Typography>
                                <Typography variant="body2">{project.overview}</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={6} sm={4} md={4}>
                            <Grid item xs={12} sm={12} md={12}>
                                <DescriptionTile display="flex" alignItems="center" bgcolor="primary.light" p={2}
                                                 borderRadius={2}>
                                    <CalendarTodayIcon fontSize="small"/>
                                    <Box ml={2}>
                                        <Typography variant="subtitle2">Deal Date</Typography>
                                        <Typography variant="body2">{formattedEndDate}</Typography>
                                    </Box>
                                </DescriptionTile>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6}>
                                <DescriptionTile display="flex" alignItems="center" bgcolor="primary.light" p={2}
                                                 borderRadius={2}>
                                    <AttachMoneyIcon fontSize="small"/>
                                    <Box ml={2}>
                                        <Typography variant="subtitle2">Token Price</Typography>
                                        <Typography variant="body2">{project.tokenPrice}</Typography>
                                    </Box>
                                </DescriptionTile>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6}>
                                <DescriptionTile display="flex" alignItems="center" bgcolor="primary.light" p={2}
                                                 borderRadius={2}>
                                    <AccessTimeIcon fontSize="small"/>
                                    <Box ml={2}>
                                        <Typography variant="subtitle2">Vesting</Typography>
                                        <Typography variant="body2">{project.vesting}</Typography>
                                    </Box>
                                </DescriptionTile>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6}>
                                <DescriptionTile display="flex" alignItems="center" bgcolor="primary.light" p={2}
                                                 borderRadius={2}>
                                    <Box ml={2}>
                                        <Typography variant="subtitle2">Allocation</Typography>
                                        <Typography variant="body2">{project.allocation}</Typography>
                                    </Box>
                                </DescriptionTile>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6}>
                                <DescriptionTile display="flex" alignItems="center" bgcolor="primary.light" p={2}
                                                 borderRadius={2}>
                                    <Box ml={2}>
                                        <Typography variant="subtitle2">TGE</Typography>
                                        <Typography variant="body2">{project.tge}</Typography>
                                    </Box>
                                </DescriptionTile>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6}>
                                <DescriptionTile display="flex" alignItems="center" bgcolor="primary.light" p={2}
                                                 borderRadius={2}>
                                    <Box ml={2}>
                                        <Typography variant="subtitle2">Claim</Typography>
                                        <Typography variant="body2">{project.claim}</Typography>
                                    </Box>
                                </DescriptionTile>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6}>
                                <DescriptionTile display="flex" alignItems="center" bgcolor="primary.light" p={2}
                                                 borderRadius={2}>
                                    <Box ml={2}>
                                        <Typography variant="subtitle2">Investors</Typography>
                                        <Typography variant="body2">{project.investments?.length}</Typography>
                                    </Box>
                                </DescriptionTile>
                            </Grid>
                    </Grid>

                </MainItems>

                {project.hasPermissionToInvest && (<InvestBox mt={4}>
                    {project!.invested &&
                        <Box>
                            <Box>
                                <Typography variant="h5">Your investments</Typography>
                                <InvestmentList investments={project!.invested}></InvestmentList>
                            </Box>
                        </Box>}
                    <Box>
                        <Typography variant="h5">Invest into the project</Typography>
                        <InvestmentForm project={project}/>
                    </Box>
                </InvestBox>)}
            </Container>
        </ProjectList>
    );
};

export default ProjectDetailPage;

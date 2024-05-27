import React, {useState, useEffect, ChangeEvent, FormEvent, useContext} from 'react';
import {
    GetAllProjectsDocument,
    InvestmentType,
    Project,
    useCreateProjectMutation, useDeleteProjectMutation,
    useUpdateProjectMutation
} from '../../../../../generated/graphql';
import {UserContext} from '../../dashboard/dashboard-page';
import {
    Container,
    TextField,
    Select,
    MenuItem,
    Button,
    Checkbox,
    FormControlLabel,
    Typography,
    CircularProgress,
    Box,
    FormControl,
    InputLabel,
    Grid,
} from '@mui/material';
import {SelectChangeEvent} from '@mui/material/Select';
import DeleteIcon from '@mui/icons-material/Delete';

const ProjectForm: React.FC<{ project: Project | null, onCancel: () => void }> = ({project, onCancel}) => {
    const user = useContext(UserContext);
    const [createProject, {loading: creating, error: createError}] = useCreateProjectMutation({
        refetchQueries: [{query: GetAllProjectsDocument}]
    });
    const [updateProject, {loading: updating, error: updateError}] = useUpdateProjectMutation({
        refetchQueries: [{query: GetAllProjectsDocument}]
    });

    const [deleteProject, {loading: deleting, error: deleteError}] = useDeleteProjectMutation({
        refetchQueries: [{query: GetAllProjectsDocument}]
    });

    const [formState, setFormState] = useState({
        name: '',
        description: '',
        type: InvestmentType.CryptoInvestment,
        imageUrl: '',
        allocation: 0,
        startDate: '',
        endDate: '',
        approved: false,
        minInvestment: 1,
        maxInvestment: 100,
        dealDate: '',
        tokenPrice: '',
        vesting: '',
        totalRaisingAmount: '',
        syndicateRaisingAmount: '',
        leadingInvestor: '',
        category: '',
        valuation: '',
        tge: '',
        claim: '',
        overview: '',
        longDescription: ''
    });

    useEffect(() => {
        if (project) {
            setFormState({
                name: project.name,
                description: project.description,
                type: project.type,
                imageUrl: project.imageUrl || '',
                allocation: project.allocation,
                startDate: project.startDate ? new Date(project.startDate).toISOString() : '',
                endDate: project.endDate ? new Date(project.endDate).toISOString() : '',
                approved: project.approved,
                minInvestment: project.minInvestment,
                maxInvestment: project.maxInvestment,
                dealDate: project.dealDate ? new Date(project.dealDate).toISOString() : '',
                tokenPrice: project.tokenPrice || '',
                vesting: project.vesting || '',
                totalRaisingAmount: project.totalRaisingAmount || '',
                syndicateRaisingAmount: project.syndicateRaisingAmount || '',
                leadingInvestor: project.leadingInvestor || '',
                category: project.category || '',
                valuation: project.valuation || '',
                tge: project.tge || '',
                claim: project.claim || '',
                overview: project.overview || '',
                longDescription: project.longDescription || ''
            });
        }
    }, [project]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value, type} = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const {name, value} = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: value as InvestmentType
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (project) {
                await updateProject({
                    variables: {id: project.id, input: {...formState, allocation: Number(formState.allocation)}}
                });
            } else {
                await createProject({
                    variables: { input: {...formState, allocation: Number(formState.allocation)}}
                });
            }
            onCancel();
        } catch (error) {
            console.error('Error saving project:', error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box mt={3}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {project ? 'Edit Project' : 'Create New Project'}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Project Name"
                        name="name"
                        value={formState.name}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Project Description"
                        name="description"
                        value={formState.description}
                        onChange={handleInputChange}
                        margin="normal"
                        multiline
                        rows={4}
                        required
                    />
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel>Project Type</InputLabel>
                        <Select
                            name="type"
                            value={formState.type}
                            onChange={handleSelectChange}
                        >
                            <MenuItem value={InvestmentType.CryptoInvestment}>Crypto investment</MenuItem>
                            <MenuItem value={InvestmentType.ClassicInvestment}>Classic investment</MenuItem>
                            <MenuItem value={InvestmentType.Unknown}>Unknown</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        label="Image URL"
                        name="imageUrl"
                        value={formState.imageUrl}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Funding Allocation"
                                name="allocation"
                                type="number"
                                value={formState.allocation}
                                onChange={handleInputChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Minimal Investment"
                                name="minInvestment"
                                type="number"
                                value={formState.minInvestment}
                                onChange={handleInputChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Maximal Investment"
                                name="maxInvestment"
                                type="number"
                                value={formState.maxInvestment}
                                onChange={handleInputChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Start Date"
                                name="startDate"
                                type="datetime-local"
                                value={formState.startDate}
                                onChange={handleInputChange}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="End Date"
                                name="endDate"
                                type="datetime-local"
                                value={formState.endDate}
                                onChange={handleInputChange}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Deal Date"
                                name="dealDate"
                                type="datetime-local"
                                value={formState.dealDate}
                                onChange={handleInputChange}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Token Price"
                                name="tokenPrice"
                                value={formState.tokenPrice}
                                onChange={handleInputChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Vesting"
                                name="vesting"
                                value={formState.vesting}
                                onChange={handleInputChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Total Raising Amount"
                                name="totalRaisingAmount"
                                value={formState.totalRaisingAmount}
                                onChange={handleInputChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Syndicate Raising Amount"
                                name="syndicateRaisingAmount"
                                value={formState.syndicateRaisingAmount}
                                onChange={handleInputChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Leading Investor"
                                name="leadingInvestor"
                                value={formState.leadingInvestor}
                                onChange={handleInputChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Category"
                                name="category"
                                value={formState.category}
                                onChange={handleInputChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Valuation"
                                name="valuation"
                                value={formState.valuation}
                                onChange={handleInputChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="TGE"
                                name="tge"
                                value={formState.tge}
                                onChange={handleInputChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Claim"
                                name="claim"
                                value={formState.claim}
                                onChange={handleInputChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Overview"
                                name="overview"
                                value={formState.overview}
                                onChange={handleInputChange}
                                margin="normal"
                                multiline
                                rows={4}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Long Description"
                                name="longDescription"
                                value={formState.longDescription}
                                onChange={handleInputChange}
                                margin="normal"
                                multiline
                                rows={4}
                            />
                        </Grid>
                    </Grid>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="approved"
                                checked={formState.approved}
                                onChange={handleInputChange}
                            />
                        }
                        label="Approved"
                    />
                    <Box mt={2} display="flex" justifyContent="space-between" position="sticky" bottom={5}
                         bgcolor="white">
                        <Button type="submit" variant="contained" color="primary"
                                disabled={creating || updating || deleting}>
                            {project ? 'Update Project' : 'Create Project'}
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button variant="outlined" color="secondary" disabled={creating || updating || deleting}
                                onClick={
                                    async () => {
                                        await deleteProject({variables: {id: project!.id}});
                                        onCancel()
                                    }
                                }>
                            <DeleteIcon/> Delete
                        </Button>
                    </Box>
                    {(creating || updating) && <CircularProgress/>}
                    {(createError || updateError) &&
                        <Typography color="error">Error: {createError?.message || updateError?.message}</Typography>}
                    {deleteError && <Typography color="error">Error: {deleteError?.message}</Typography>}
                </form>
            </Box>
        </Container>
    );
}

export default ProjectForm;

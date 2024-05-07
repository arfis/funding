import React, { useState, useEffect, ChangeEvent, FormEvent, useContext } from 'react';
import {
    GetAllProjectsDocument,
    InvestmentType,
    Project,
    useCreateProjectMutation,
    useUpdateProjectMutation
} from '../../../../../generated/graphql';
import { UserContext } from '../../dashboard/dashboard-page';
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
    InputLabel
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

const ProjectForm: React.FC<{ project: Project | null, onCancel: () => void }> = ({ project, onCancel }) => {
    const user = useContext(UserContext);
    const [createProject, { loading: creating, error: createError }] = useCreateProjectMutation({
        refetchQueries: [{ query: GetAllProjectsDocument }]
    });
    const [updateProject, { loading: updating, error: updateError }] = useUpdateProjectMutation({
        refetchQueries: [{ query: GetAllProjectsDocument }]
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
        maxInvestment: 100
    });

    useEffect(() => {
        if (project) {
            setFormState({
                name: project.name,
                description: project.description,
                type: project.type,
                imageUrl: project.imageUrl || '',
                allocation: project.allocation,
                startDate: formState.startDate ? new Date(formState.startDate).toISOString() : new Date().toISOString(),
                endDate: formState.endDate ? new Date(formState.endDate).toISOString() : new Date().toISOString(),
                approved: project.approved,
                minInvestment: project.minInvestment,
                maxInvestment: project.maxInvestment
            });
        }
    }, [project]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
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
                    variables: { id: project.id, input: { ...formState, allocation: Number(formState.allocation) } }
                });
            } else {
                await createProject({
                    variables: { ...formState, allocation: Number(formState.allocation) }
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
                    {project ? "Edit Project" : "Create New Project"}
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
                    <TextField
                        fullWidth
                        label="Funding Allocation"
                        name="allocation"
                        type="number"
                        value={formState.allocation}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Minimal Investment"
                        name="minInvestment"
                        type="number"
                        value={formState.minInvestment}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Maximal Investment"
                        name="maxInvestment"
                        type="number"
                        value={formState.maxInvestment}
                        onChange={handleInputChange}
                        margin="normal"
                    />
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
                    <Box mt={2} display="flex" justifyContent="space-between">
                        <Button type="submit" variant="contained" color="primary" disabled={creating || updating}>
                            {project ? "Update Project" : "Create Project"}
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={onCancel}>
                            Cancel
                        </Button>
                    </Box>
                    {(creating || updating) && <CircularProgress />}
                    {(createError || updateError) && <Typography color="error">Error: {createError?.message || updateError?.message}</Typography>}
                </form>
            </Box>
        </Container>
    );
};

export default ProjectForm;

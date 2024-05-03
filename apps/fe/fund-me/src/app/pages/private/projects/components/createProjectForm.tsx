import React, {useState, ChangeEvent, FormEvent, useContext, FormEventHandler} from 'react';
import {GetAllProjectsDocument, useCreateProjectMutation} from '../../../../../generated/graphql';
import {UserContext} from '../../dashboard/dashboard-page';
import styled from 'styled-components';

const ProjectCreateForm = styled.form`
    display: flex;
    flex-direction: column;
    column-gap: 10px;
    row-gap: 10px;
    width: 60px;
    justify-content: center;
    flex-wrap: wrap;
`

const ProjectForm = () => {
    const user = useContext(UserContext)
    const [createProject, { data, loading, error }] = useCreateProjectMutation({refetchQueries: [{
        query: GetAllProjectsDocument
        }]});
    const [formState, setFormState] = useState({
        name: '',
        description: '',
        type: '',
        imageUrl: '',
        allocation: 0,
        startDate: '',
        endDate: '',
        ownerId: user.id,
        approved: false
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        setFormState(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const result = await createProject({
                variables: { ...formState, allocation: Number(formState.allocation) }
            });
            console.log('Project created:', result?.data?.createProject);
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    return (
        <ProjectCreateForm onSubmit={handleSubmit}>
            <input
                type="text"
                name="name"
                value={formState.name}
                onChange={handleInputChange}
                placeholder="Project Name"
                required
            />
            <textarea
                name="description"
                value={formState.description}
                onChange={handleInputChange}
                placeholder="Project Description"
                required
            />
            <input
                type="text"
                name="type"
                value={formState.type}
                onChange={handleInputChange}
                placeholder="Project Type"
                required
            />
            <input
                type="text"
                name="imageUrl"
                value={formState.imageUrl}
                onChange={handleInputChange}
                placeholder="Image URL"
            />
            <input
                type="number"
                name="allocation"
                value={formState.allocation}
                onChange={handleInputChange}
                placeholder="Funding Allocation"
            />
            <input type="datetime-local" name="startDate" value={formState.startDate} onChange={handleInputChange}/>
            <input type="datetime-local" name="endDate" value={formState.endDate} onChange={handleInputChange}/>
            <input
                type="text"
                name="ownerId"
                value={formState.ownerId}
                onChange={handleInputChange}
                placeholder="Owner ID"
            />
            <label>
                Approved:
                <input
                    type="checkbox"
                    name="approved"
                    checked={formState.approved}
                    onChange={handleInputChange}
                />
            </label>
            <button type="submit" disabled={loading}>Create Project</button>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
        </ProjectCreateForm>
    );
};

export default ProjectForm;

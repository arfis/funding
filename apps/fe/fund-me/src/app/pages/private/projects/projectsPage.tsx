import React, {useContext, useState} from 'react';
import {Project, useGetAllProjectsQuery} from '../../../../generated/graphql';
import {UserContext} from '../dashboard/dashboard-page';
import ProjectForm from './components/createProjectForm';
import DockedLayout from '../components/DockeredLayout';
import ProjectTile from './components/projectTile';
import styled from 'styled-components';
import {Button} from '@mui/material';

const ProjectList = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    background-color: #ffffff;
`;

const ProjectsPage = () => {
    const user = useContext(UserContext);
    const {loading, error, data} = useGetAllProjectsQuery();
    const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
    const [createNewProject, setCreateNewProject] = useState<boolean>(false);
    const investIntoProject = (projectId: string) => {
        console.log('USER ' + user?.userName + ' IS INVESTING INTO ' + projectId);
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error! {error.message}</p>;

    if (data!.getAllProjects!.length > 0) {
        return (
            <div>
                <Button variant="contained" color="primary" onClick={() => setCreateNewProject(true)}>
                    Create new
                </Button>
                <DockedLayout
                    dockedContent={ (projectToEdit || createNewProject) && (
                        <ProjectForm project={projectToEdit} onCancel={() => {
                            setCreateNewProject(true)
                            setProjectToEdit(null)
                        }}/>
                    )}
                    listContent={
                        <ProjectList>
                            {data && !!data.getAllProjects && data.getAllProjects.map(project =>
                                project ? (
                                    <ProjectTile
                                        key={project.id}
                                        project={project}
                                        editClick={() => setProjectToEdit(project)}
                                        investClick={() => investIntoProject(project.id)}
                                    />
                                ) : null
                            )}
                        </ProjectList>
                    }
                />
            </div>
        );
    } else {
        <div>There are currently no projects available</div>
    }

};

export default ProjectsPage;

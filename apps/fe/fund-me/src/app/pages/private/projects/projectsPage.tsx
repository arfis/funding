import React, {useContext, useState} from 'react';
import {Project, useGetAllProjectsQuery} from '../../../../generated/graphql';
import {UserContext} from '../dashboard/dashboard-page';
import ProjectForm from './components/createProjectForm';
import DockedLayout from '../components/DockeredLayout';
import ProjectTile from './components/projectTile';
import styled from 'styled-components';

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

    const investIntoProject = (projectId: string) => {
        console.log('USER ' + user?.userName + ' IS INVESTING INTO ' + projectId);
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error! {error.message}</p>;

    if (data!.getAllProjects!.length > 0) {
        return (
            <DockedLayout
                dockedContent={projectToEdit && (
                    <ProjectForm project={projectToEdit} onCancel={() => setProjectToEdit(null)}/>
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
        );
    } else {
        <div>There are currently no projects available</div>
    }

};

export default ProjectsPage;

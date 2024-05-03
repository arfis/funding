import React, {useContext} from 'react';
import styled from 'styled-components';
import {Project} from './components/project';
import {useGetAllProjectsQuery} from '../../../../generated/graphql';
import {UserContext} from '../dashboard/dashboard-page';

const ProjectsContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
    column-gap: 20px;
`;

const ProjectsPage = () => {
    const user = useContext(UserContext)
    const {loading, error, data} = useGetAllProjectsQuery();

    const investIntoProject = (projectId: string) => {
        console.log('USER ' + user?.name + ' IS INVESTING INTO ' + projectId);
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error! {error.message}</p>;

    return (
        <>
            <h1>Projects</h1>
            <ProjectsContainer>
                {
                    data && !!data.getAllProjects && data.getAllProjects!.map(project =>

                    project ?
                        <Project key={project.name}
                                 id={project.id}
                                 name={project.name}
                                 description={project.description}
                                 availableAllocation={project.allocation}
                                 investClick={() => investIntoProject(project.id)}
                        />
                        : null
                    )
                }
            </ProjectsContainer>
        </>
    );
};

export default ProjectsPage;

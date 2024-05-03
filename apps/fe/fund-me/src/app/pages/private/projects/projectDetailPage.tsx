import React, {useContext} from 'react';
import styled from 'styled-components';
import {useParams} from 'react-router-dom';
import {useGetProjectQuery} from '../../../../generated/graphql';
import {UserContext} from '../dashboard/dashboard-page';

const ProjectsContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
    column-gap: 20px;
`;

const ProjectDetailPage = () => {
    const {id} = useParams<{ id: string }>();
    const user = useContext(UserContext)
    const {loading, error, data} = useGetProjectQuery({variables: {id: id ?? ''}});

    const project = data?.getProject;
    if (!project) return <p>No project found!</p>;

    const investIntoProject = (projectId: string) => {
        console.log('USER ' + user?.name + ' IS INVESTING INTO ' + projectId);
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error! {error.message}</p>;

    return (
            <ProjectsContainer>
                <h2>{project.name}</h2>
                <p>{project.description}</p>
            </ProjectsContainer>
    );
};

export default ProjectDetailPage;

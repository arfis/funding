import React, { createContext, useContext, useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser, User } from '../../../store/features/user-slice';
import { RootState } from '../../../store/store';
import { Route, Routes, Navigate } from 'react-router-dom';
import ProjectsPage from '../projects/projectsPage';
import ProfilePage from '../profile/profile-page';
import ProjectDetailPage from '../projects/projectDetailPage';
import { QuizPage } from '../quiz/quizPage';
import QuizTakePage from '../quiz/quiz-take/quizTakePage';
import { HEADER_HEIGHT } from '../../../constants';
import NavigationHeader from './components/navigationHeader';

const LoggedInContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    box-sizing: border-box;
    width: 100%;
`;

const Content = styled.div`
    height: 100%;
    width: 100%;
`;

export const UserContext = createContext({} as User);

const DashboardPage = () => {
    const user = useSelector((state: RootState) => state.loggedInUser.user);
    const dispatch = useDispatch();

    const handleLogout = () => {
        console.log('HANDLE LOGOUT')
        dispatch(clearUser());
    };

    const links = [
        { to: '/projects', label: 'Projects' },
        { to: '/quizTake', label: 'QuizTake' },
        { to: '/quizes', label: 'Quizes' },
    ];

    if (user) {
        return (
            <UserContext.Provider value={user}>
                <LoggedInContainer>
                    <NavigationHeader
                        links={links}
                        onLogout={handleLogout}
                        userName={user.userName}
                        avatarUrl={user.avatarUrl}
                    />
                    <Content>
                        <Routes>
                            <Route path="/projects/:id" element={<ProjectDetailPage />} />
                            <Route path="/projects" element={<ProjectsPage />} />
                            <Route path="/quizes" element={<QuizPage />} />
                            <Route path="/quizTake" element={<QuizTakePage type={'CRYPTO'} />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/" element={<Navigate to="/projects" />} />
                        </Routes>
                    </Content>
                </LoggedInContainer>
            </UserContext.Provider>
        );
    }

    return <>NOT LOGGED IN</>;
};

export default DashboardPage;

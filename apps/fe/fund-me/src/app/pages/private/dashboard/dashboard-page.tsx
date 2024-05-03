import React, {createContext, useContext, useEffect} from 'react';
import styled from 'styled-components';
import {useSelector, useDispatch} from 'react-redux'
import {clearUser, User} from '../../../store/features/user-slice';
import {RootState} from '../../../store/store';
import {Route, Routes, Link, Navigate} from 'react-router-dom';
import ProjectsPage from '../projects/projectsPage'
import ProfilePage from '../profile/profile-page'
import ProjectDetailPage from '../projects/projectDetailPage';

const Navigation = styled.div`
    display: flex;
    column-gap: 10px;
    align-items: center;
    justify-content: center;
    background-color: #f7f7f7;
    padding: 20px;
    box-sizing: border-box;
    width: 100%;
`

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
        dispatch(clearUser());
    };

    if (user) {
        return (
            <UserContext.Provider value={user}>
                <LoggedInContainer>
                    <Navigation role="navigation">
                        <Link to="/projects">Projects</Link>
                        <Link to="/profile">{user?.name}</Link>
                        <Link to="/login"><span onClick={handleLogout}>Logout</span></Link>
                    </Navigation>
                    <Content>
                        <Routes>
                            <Route path="/projects/:id" element={<ProjectDetailPage/>}/>
                            <Route path="/projects" element={<ProjectsPage/>}/>
                            <Route path="/profile" element={<ProfilePage/>}/>
                            <Route path="/" element={<Navigate to="/projects"/>}/>
                        </Routes>
                    </Content>
                </LoggedInContainer>
            </UserContext.Provider>
        );
    }

    return (<>
    NOT LOGGED IN
    </>)

};

export default DashboardPage;

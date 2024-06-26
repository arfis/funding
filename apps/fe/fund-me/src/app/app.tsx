import styled, {createGlobalStyle} from 'styled-components';


import {Route, Routes, Link, Navigate, useSearchParams} from 'react-router-dom';
import LoginPage from './pages/public/login/login-page';
import RegisterPage from './pages/public/register/register-page'
import DashboardPage from './pages/private/dashboard/dashboard-page';


import {useDispatch, useSelector} from 'react-redux';
import {RootState} from './store/store';
import {jwtDecode} from 'jwt-decode';
import React, {useEffect, useCallback, useRef} from 'react';
import {clearUser, setUser, User} from './store/features/user-slice';
import {getCookie} from './util/cookie.util';
import HookTest from './pages/public/hook-test/hookTest';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Lato', sans-serif;
  }
`;

const StyledApp = styled.div`
    // Your style here
    display: flex;
    flex-direction: row;
`;

const Content = styled.div`
    width: 100%;
    background-color: #ffffff;
`;

import {ThemeProvider, createTheme} from '@mui/material/styles';
import {theme} from './theme';

export function App() {
    const user = useSelector((state: RootState) => state.loggedInUser.user);
    const dispatch = useDispatch();
    const prevToken = useRef('');

    useEffect(() => {
        const token = getCookie('AuthToken');
        if (token && token !== prevToken.current) {
            setToken(token);
            prevToken.current = token; // Update the ref after handling token
        } else if (!token) {
            dispatch(clearUser())
        }
    }, []);

    const setToken = useCallback((token: string) => {
        try {
            const decoded = jwtDecode<User>(token);
            setUserDetails(decoded, token);
        } catch (e) {
            console.error('Invalid token', e);
        }
    }, []);

    const setUserDetails = useCallback((decodedToken: User, token: string) => {
        dispatch(setUser({...decodedToken, token}));
    }, []);

    return user ? (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <StyledApp>
                <DashboardPage></DashboardPage>
            </StyledApp>
        </ThemeProvider>
    ) : (
        <Content>
            {/*<ul>*/}
            {/*    <li>*/}
            {/*        <Link to="/register">Register</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*        <Link to="/login">Login</Link>*/}
            {/*    </li>*/}
            {/*    <li>*/}
            {/*        <Link to="/hook-test">Hook test</Link>*/}
            {/*    </li>*/}
            {/*</ul>*/}
            <Routes>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/hook-test" element={<Navigate to="/"/>}/>
            </Routes>
        </Content>
    );
}

export default App;


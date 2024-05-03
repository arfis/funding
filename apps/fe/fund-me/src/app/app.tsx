import styled from 'styled-components';


import {Route, Routes, Link, Navigate, useSearchParams} from 'react-router-dom';
import LoginPage from './pages/public/login/login-page';
import RegisterPage from './pages/public/register/register-page'
import DashboardPage from './pages/private/dashboard/dashboard-page';


import {useDispatch, useSelector} from 'react-redux';
import {RootState} from './store/store';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useCallback, useRef } from 'react';
import { setUser } from './store/features/user-slice';
import { getCookie } from './util/cookie.util';
import HookTest from './pages/public/hook-test/hookTest';

const StyledApp = styled.div`
  // Your style here
  display: flex;
  flex-direction: row;
`;

const Content = styled.div`
  width: 100%;
  background-color: #ffffff;
`;

export function App() {
    const user = useSelector((state: RootState) => state.loggedInUser.user);
    const dispatch = useDispatch();
    const prevToken = useRef("");

    useEffect(() => {
        const token = getCookie('AuthToken');
        console.log('GOT TOKEN ', token);
        if (token && token !== prevToken.current) {
            setToken(token);
            prevToken.current = token; // Update the ref after handling token
        }
    }, []);

    const setToken = useCallback((token: string) => {
        try {
            const decoded = jwtDecode(token);
            setUserDetails(decoded);
        } catch (e) {
            console.error('Invalid token', e);
        }
    }, []);

    const setUserDetails = useCallback((decodedToken: any) => {
        dispatch(setUser({name: decodedToken.name, email: decodedToken.id}));
    }, []);

    return user ? (
        <StyledApp>
           <DashboardPage></DashboardPage>
        </StyledApp>
    ) : (
        <Content>
            <ul>
                <li>
                    <Link to="/register">Profile</Link>
                </li>
                <li>
                    <Link to="/login">Projects</Link>
                </li>
                <li>
                    <Link to="/hook-test">Hook test</Link>
                </li>
            </ul>
            <Routes>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/" element={<HookTest/>}/>
                <Route path="/hook-test" element={<Navigate to="/"/>}/>
            </Routes>
        </Content>
    );
}

export default App;


import React, { useEffect } from 'react';
import styled from 'styled-components';
import {useSelector, useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom';
import { clearUser, setUser } from '../../../store/features/user-slice';
import { RootState } from '../../../store/store';
import {jwtDecode} from 'jwt-decode';

const LoggedInContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f7f7f7;
  padding: 20px;
  box-sizing: border-box;
`;

const ProfilePage = () => {
    const user = useSelector((state: RootState) => state.loggedInUser.user);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(clearUser());
    };

    return (
        <LoggedInContainer>
            <h1>Profile</h1>
        </LoggedInContainer>
    );
};

export default ProfilePage;

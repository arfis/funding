import React from 'react';
import styled from 'styled-components';
import { GoogleLoginButton, FacebookLoginButton } from 'react-social-login-buttons';
import { useDispatch } from 'react-redux';
import {setUser} from '../../../store/features/user-slice';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
`;

const LoginPage = () => {
    const dispatch = useDispatch();

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:3000/login";
        // dispatch(setUser({ name: 'John Doe', email: 'john@example.com' }));
        // Implement your login logic here
    };

    const handleFacebookLogin = () => {
        console.log("Login with Facebook");
        // Implement your login logic here
    };

    return (
        <LoginContainer>
            <h1>Login to Your Account</h1>
            <GoogleLoginButton onClick={handleGoogleLogin} />
            <FacebookLoginButton onClick={handleFacebookLogin} />
        </LoginContainer>
    );
};

export default LoginPage;

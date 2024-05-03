import React, { useState, ChangeEvent } from 'react';
import styled from 'styled-components';
import {useDispatch} from 'react-redux';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
`;


interface LoginData {
    email: string;
    password: string;
}

const RegisterPage = () => {
    const dispatch = useDispatch();
    const [loginData, setLoginData] = useState({email: "", password: ""})
    const handleGoogleLogin = () => {
        console.log('Login with Google');
        window.location.href = 'http://localhost:3000/login';
// dispatch(setUser({ name: 'John Doe', email: 'john@example.com' }));
// Implement your login logic here
    };

    const handleFacebookLogin = () => {
        console.log('Login with Facebook');
// Implement your login logic here
    };

    function handleFormChange(e: React.ChangeEvent<HTMLInputElement>) {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
    }

    return (
        <LoginContainer>
            <h1>Register a new account</h1>
            <input value={loginData.email}
                   name="email"
                   onChange={handleFormChange}/>
            <input value={loginData.password}
                   name="password"
                   onChange={handleFormChange}/>
            <button>Register</button>
        </LoginContainer>
    );
};

export default RegisterPage;

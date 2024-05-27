import React from 'react';
import styled from 'styled-components';
import { GoogleLoginButton } from 'react-social-login-buttons';
import {ethers} from 'ethers';

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

    const connectToMetaMask = async () => {
        if (typeof (window as any).ethereum !== 'undefined') {
            try {
                const provider = new ethers.BrowserProvider((window as any).ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = await provider.getSigner();
                const address = await signer.getAddress();
                console.log("Connected address:", address);
                return address;
            } catch (error) {
                console.error("User rejected the request");
            }
        } else {
            console.error("MetaMask not found");
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:3000/login";
        // dispatch(setUser({ name: 'John Doe', email: 'john@example.com' }));
        // Implement your login logic here
    };


    const assignWalletToGoogleUser = async (googleToken: string) => {
        const walletAddress = await connectToMetaMask();
        if (walletAddress) {
            const response = await fetch('http://localhost:3000/assign-wallet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ googleToken, walletAddress })
            });
            const data = await response.json();
            console.log(data);
        }
    };

    const handleMetaMaskLogin = async () => {
        const walletAddress = await connectToMetaMask();
        if (walletAddress) {
            fetch('http://localhost:3000/login/metamask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ walletAddress })
            }).then(response => response.json())
                .then(data => {
                    console.log(data);
                    // Handle response data
                });
        }
    };

    return (
        <LoginContainer>
            <h1>Login to Your Account</h1>
            <GoogleLoginButton onClick={handleGoogleLogin}/>
            <button onClick={handleMetaMaskLogin}>Login with MetaMask</button>
            {/*<FacebookLoginButton onClick={handleFacebookLogin} />*/}
        </LoginContainer>
    );
};

export default LoginPage;

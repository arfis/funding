import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../../../store/features/user-slice';
import { RootState } from '../../../store/store';
import { ethers } from 'ethers';

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

    const assignWalletToUser = async () => {
        const walletAddress = await connectToMetaMask();
        if (walletAddress && user) {
            const res = await fetch('http://localhost:3000/assign-wallet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}` // Use JWT token for authorization
                },
                body: JSON.stringify({ walletAddress })
            });
            const data = await res.json();
            console.log(data);
            // Handle response data if necessary
        }
    };

    return (
        <LoggedInContainer>
            <h1>Profile</h1>
            <p>Welcome, {user?.userName}</p>
            <button onClick={assignWalletToUser}>ASSIGN METAMASK</button>
            <button onClick={handleLogout}>Logout</button>
        </LoggedInContainer>
    );
};

export default ProfilePage;

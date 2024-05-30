import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {AppBar, Toolbar, IconButton, Button, Menu, MenuItem} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {Link, LinkProps, NavLink} from 'react-router-dom';
import { ethers } from "ethers";
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Fortmatic from 'fortmatic';
import {useEthereumAddress} from '../../hooks/useEthereumAddress';

const Header = styled(AppBar)`
    background-color: #fff;
    border-bottom: 1px solid #e0e0e0;
`;

const Logo = styled.img`
    height: 40px;
    margin-right: 20px;
`;

const MenuContainer = styled.div`
    display: flex;
    align-items: center;
    flex-grow: 1;
`;

const MenuItemLink = styled(NavLink)`
    color: #333;
    //font-weight: 600;
    margin: 0 10px;
    text-transform: none;
    text-decoration: none;

    &.active {
        text-decoration: underline;
    }

    &:hover {
        color: #8a8686;
    }
`;

const UserDetailButton = styled(Button)`
    margin-left: auto;
    color: #333;
    text-transform: none;
`;

const LanguageButton = styled(Button)`
    border: 1px solid #333;
    margin-right: 20px;
    text-transform: none;
`;

const WalletInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

interface NavigationHeaderProps {
    links: { to: string; label: string }[];
    onLogout: () => void;
    userName: string;
    avatarUrl: string;
}

const ConnectButton = styled.button`
  background-color: #f39c12;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
`;

const NavigationHeader: React.FC<NavigationHeaderProps> = ({links, onLogout, userName, avatarUrl}) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [balance, setBalance] = useState<string>("");
    const walletAddress = useEthereumAddress();

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
            } catch (error) {
                console.error('User rejected the request');
            }
        } else {
            alert('Install MetaMask extension!!');
        }
    };

    const getBalance = async (address: string) => {
        try {
            const balance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [address, 'latest'],
            });
            setBalance(ethers.formatEther(balance));
        } catch (error) {
            console.error('Error getting balance:', error);
        }
    };

    useEffect(() => {
        if (walletAddress) {
            getBalance(walletAddress);
        }
    }, [walletAddress]);

    return (
        <Header position="static">
            <Toolbar>
                <Logo src="path_to_logo.png" alt="Logo"/>
                <MenuContainer>
                    {links.map((link) => (
                        <MenuItemLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? 'active' : 'inactive')}>
                            {link.label}
                        </MenuItemLink>
                    ))}
                </MenuContainer>
                <LanguageButton>EN</LanguageButton>
                {walletAddress && balance ? (
                    <WalletInfo>
                        <div>Wallet: {walletAddress}</div>
                        <div>Balance: {balance} ETH</div>
                    </WalletInfo>
                ) : (
                    <ConnectButton onClick={connectWallet}>Connect Wallet</ConnectButton>
                )}
                <UserDetailButton  color="inherit" onClick={handleMenu}>
                    <img src={avatarUrl} alt="User Avatar"
                         style={{marginRight: '8px', height: '30px', borderRadius: '50%'}}/>
                    {userName}
                </UserDetailButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                    <MenuItemLink to={"profile"}>Profile</MenuItemLink>
                    <MenuItem onClick={() => onLogout()}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </Header>
    );
};

export default NavigationHeader;

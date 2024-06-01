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
import {theme} from '../../../../theme';
import {HEADER_HEIGHT} from '../../../../constants';
import PaidIcon from '@mui/icons-material/Paid';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
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
    height: ${HEADER_HEIGHT};
`;

const NonDecoratedLink = styled(Link)`
    text-decoration: none;
    color: black;
`

const MenuItemLink = styled(NavLink)`
    color: #333;
    display: flex;
    height: 100%;
    padding: 0 10px;
    text-transform: none;
    cursor: pointer;
    text-decoration: none;
    align-items: center;
    background-color: inherit;
    transition: background-color .15s ease-in;
    
    &.active {
        height: calc(${HEADER_HEIGHT} - 3px);
        color: ${theme.palette.primary.contrastText};
        border-bottom: 3px solid ${theme.palette.secondary.dark};
    }

    &:hover {
        //border-radius: 5px;
        background-color: rgba(0, 0, 0, 0.04)
    }
`;

const UserDetailButton = styled(Button)`
    margin-left: auto;
    color: #333;
    text-transform: none;
    height: 100%;
`;

const WalletItem = styled.div`
    display: flex;
    align-items: center;
    border-radius: 20px;
    padding: 0 5px;
    margin: 2px;
    color: inherit;
`;

const WalletInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-size: 12px;
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
                {walletAddress && balance ? (
                    <WalletInfo>
                        <WalletItem>
                            <AccountBalanceWalletIcon/>
                            {walletAddress}
                        </WalletItem>
                        <WalletItem>
                            <PaidIcon/>
                            {balance} ETH
                        </WalletItem>

                    </WalletInfo>
                ) : (
                    <ConnectButton onClick={connectWallet}>Connect Wallet</ConnectButton>
                )}
                <UserDetailButton color="inherit" onClick={handleMenu}>
                    <img src={avatarUrl} alt="User Avatar"
                         style={{marginRight: '8px', height: '30px', borderRadius: '50%'}}/>
                    {userName}
                </UserDetailButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                    <MenuItem><NonDecoratedLink to={"profile"}>Profile</NonDecoratedLink></MenuItem>
                    <MenuItem onClick={() => onLogout()}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </Header>
    );
};

export default NavigationHeader;

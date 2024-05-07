import React from 'react';
import styled from 'styled-components';
import {AppBar, Toolbar, IconButton, Button, Menu, MenuItem} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {Link, LinkProps, NavLink} from 'react-router-dom';

const Header = styled(AppBar)`
    background-color: #fff;
    box-shadow: none;
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

interface NavigationHeaderProps {
    links: { to: string; label: string }[];
    onLogout: () => void;
    userName: string;
    avatarUrl: string;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({links, onLogout, userName, avatarUrl}) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

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
                <UserDetailButton  color="inherit" onClick={handleMenu}>
                    <img src={avatarUrl} alt="User Avatar"
                         style={{marginRight: '8px', height: '30px', borderRadius: '50%'}}/>
                    {userName}
                </UserDetailButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                    <MenuItem>Profile</MenuItem>
                    <MenuItem onClick={() => onLogout()}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </Header>
    );
};

export default NavigationHeader;

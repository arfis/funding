import styled from 'styled-components';
import AddIcon from '@mui/icons-material/AddCircle';
import React from 'react';

const FloatingButtonWrapper = styled.div`
    position: absolute;
    bottom: 10px;
    right: 10px;
    cursor: pointer;

    &:hover {
        opacity: 0.6;
    }

    svg {
        width: 64px; // Adjust the size here
        height: 64px; // Adjust the size here
    }
`;

interface FloatingButtonProps {
    onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const FloatingButton:  React.FC<FloatingButtonProps> = ({ onClick }) => (
    <FloatingButtonWrapper onClick={onClick}>
        <AddIcon color="primary" />
    </FloatingButtonWrapper>
);

export default FloatingButton;

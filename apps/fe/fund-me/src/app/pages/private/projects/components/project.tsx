import styled from 'styled-components';
import {Link} from 'react-router-dom';
import React from 'react';

const Frame = styled.div`
    border: 1px solid rgba(128, 128, 128, 0.49);
    border-radius: 5px;
    min-width: 300px;
    
    h1 {
        color: red;
    }
`

export const Project = ({id, name, availableAllocation, investClick, description}: { id: string, name: string, availableAllocation: number, investClick: () => void , description: string}) => {
    const projectUrl = "/projects/"+id;
    return (
        <Frame>
            <Link to={projectUrl}><h1>{name}</h1></Link>
            <div className="content">
                <p>{description}</p>
            </div>

            <span>Available: {availableAllocation}Eur</span>
            <button onClick={investClick}>Invest</button>
        </Frame>
    )
}

import styled from 'styled-components';
import {Link} from 'react-router-dom';
import React from 'react';
import {Card, CardContent, Typography, Button, CardActions, Box} from '@mui/material';
import {Project} from '../../../../../generated/graphql';
import EditIcon from '@mui/icons-material/Edit';
import AlocationProgress from '../../components/AlocationProgress';

const Frame = styled(Card)`
    border-radius: 8px;
    width: 350px;
    height: auto;
    margin: 20px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;

    .image-container {
        text-align: center;
        height: 300px;
        width: 350px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        justify-content: center;
        overflow: hidden;

        img {
            max-width: 100%;
            max-height: 100%;
            border-radius: 8px 8px 0 0;
            object-fit: cover;
        }
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
    }

    .badges {
        display: flex;
        gap: 8px;
        margin-bottom: 8px;
    }

    .badge {
        padding: 4px 8px;
        border-radius: 12px;
        color: white;
        font-size: 12px;
        text-transform: uppercase;
    }

    .content {
        padding: 16px;
    }

    .actions {
        display: flex;
        justify-content: space-between;
        padding: 16px;
    }

    .detail-link {
        color: #E57373;
        text-decoration: none;
        margin-top: 10px;
        display: inline-block;
    }

    .info-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
    }
`;

const StatusBadge = styled.span<{ color: string }>`
    background-color: ${props => props.color};
`;

const ProjectTile: React.FC<{ project: Project, editClick: () => void, investClick: () => void }> = ({
                                                                                                         project,
                                                                                                         investClick,
                                                                                                         editClick
                                                                                                     }) => {
    const projectUrl = `/projects/${project.id}`;
    const {
        category,
        type,
        name,
        description,
        allocation,
        imageUrl,
        hasPermissionToInvest,
        hasPermissionToEdit,
        freeAllocation
    } = project;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return '#4caf50';
            case 'INACTIVE':
                return '#f44336';
            default:
                return '#757575';
        }
    };

    return (
        <Frame>
            {imageUrl && (
                <div className="image-container">
                    <img src={imageUrl} alt={name}/>
                </div>
            )}
            <Box className="header">
                <div className="badges">
                    {category && <StatusBadge className="badge" color="#757575">{category}</StatusBadge>}
                    <StatusBadge className="badge" color={getStatusColor('ACTIVE')}>Active</StatusBadge>
                </div>
                <StatusBadge className="badge" color="#E57373">{type}</StatusBadge>
            </Box>
            <CardContent className="content">
                <Link to={projectUrl} style={{textDecoration: 'none'}}>
                    <Typography variant="h6" component="h2">
                        {name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {description}
                    </Typography>
                </Link>
                <AlocationProgress freeAllocation={project.freeAllocation as number} allocation={project.allocation as number}/>
                <div className="info-row">
                    <Typography variant="body2" color="textSecondary">
                        Total Allocation:
                    </Typography>
                    <Typography variant="body2">
                        {allocation}Eth
                    </Typography>
                </div>
                <div className="info-row">
                    <Typography variant="body2" color="textSecondary">
                        Free allocation:
                    </Typography>
                    <Typography variant="body2">
                        {freeAllocation}Eth
                    </Typography>
                </div>
                <div className="info-row">
                    <Typography variant="body2" color="textSecondary">
                        Investors:
                    </Typography>
                    <Typography variant="body2">
                        {project.investments?.length || 0}
                    </Typography>
                </div>
                {/*<div className="info-row">*/}
                {/*    <Typography variant="body1">*/}
                {/*        /!*35 - 70% p.a.*!/??*/}
                {/*    </Typography>*/}
                {/*    <Typography variant="body2" color="textSecondary">*/}
                {/*        Required return*/}
                {/*    </Typography>*/}
                {/*</div>*/}
                {/*<Link to={projectUrl}>*/}
                {/*    <Typography className="detail-link" variant="body2">*/}
                {/*        Detail →*/}
                {/*    </Typography>*/}
                {/*</Link>*/}
            </CardContent>
            <CardActions className="actions">
                {hasPermissionToInvest && (
                    <Link to={projectUrl}>
                        <Button variant="contained" color="primary" onClick={investClick}>
                            Invest
                        </Button>
                    </Link>)}
                {hasPermissionToEdit && (<Button variant="outlined" color="primary" onClick={editClick}>
                    <EditIcon></EditIcon>
                </Button>)}
            </CardActions>
        </Frame>
    );
}

export default ProjectTile;

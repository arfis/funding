import {LinearProgress} from '@mui/material';
import React from 'react';

const AlocationProgress = ({freeAllocation, allocation}: {freeAllocation: number, allocation: number}) => {

    const progress = 100 - (freeAllocation as number / (allocation as number)) * 100;

    return (<LinearProgress variant="determinate"
                            color={progress > 90 ? "error" : "primary"}
                            value={progress}/>)
}

export default AlocationProgress

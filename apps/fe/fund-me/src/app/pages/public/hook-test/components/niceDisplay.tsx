import styled from 'styled-components';
import {useContext} from 'react';
import {NumberContext} from '../hookTest';

const NiceHeader = styled.h1`
    font-size: 18px;
    color: #c03934;
`
const NiceDisplay = () => {

    const value = useContext(NumberContext);

    return (
        <NiceHeader>Nice display: {value}</NiceHeader>
    )
}

export default NiceDisplay;

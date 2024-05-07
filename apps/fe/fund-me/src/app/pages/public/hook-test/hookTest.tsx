import styled from 'styled-components';
import {createContext, useEffect, useRef, useState} from 'react';
import Display from './components/display';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #f7f7f7;
    padding: 20px;
    box-sizing: border-box;
`;

export const NumberContext = createContext(0)

const HookTest = () => {
    const [number, setNumber] = useState(0);
    const renderCount = useRef(0);
    const previousValue = useRef<number>(-1);
    const inputElement = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputElement.current) {
            inputElement.current.value = String(previousValue.current);
        }
        previousValue.current = number
    }, [number]);

    useEffect(() => {
        renderCount.current = renderCount.current + 1;
    })

    useEffect(() => {

        const timer = setTimeout(() => updateNumber(), 5000);

        return () => {
            clearTimeout(timer);
        }
    }, []);

    const updateNumber = () => {
        setNumber(number + 1)
    }

    return (
        <NumberContext.Provider value={number}>
            <Container>
                <p>The page was rendered {renderCount.current} times</p>
                <p>{number}</p>

                This should hold the previous value:
                <input type="text" ref={inputElement}/>
                <Display value={number}></Display>
                <button onClick={updateNumber}>Update number</button>
            </Container>
        </NumberContext.Provider>
    )
}

export default HookTest

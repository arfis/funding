import NiceDisplay from './niceDisplay';

const Display = ({value}: { value: number }) => {

    return (
        <div>
            <h1>Displaying {value}</h1>
            <p>Nested display:</p>
            <NiceDisplay></NiceDisplay>
        </div>
    )
}

export default Display;

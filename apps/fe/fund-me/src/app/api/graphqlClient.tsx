import {ApolloClient, InMemoryCache, HttpLink, ApolloLink} from '@apollo/client';
import {onError} from '@apollo/client/link/error';
import {getCookie} from '../util/cookie.util';
import {useDispatch} from 'react-redux';
import {clearUser} from '../store/features/user-slice';

const httpLink = new HttpLink({ uri: 'http://localhost:5002/graphql' });


const authLink = new ApolloLink((operation, forward) => {
    // Retrieve the authentication token from local storage if it exists
    const token = getCookie('AuthToken');

    // Use the setContext method to set the HTTP headers.
    operation.setContext({
        headers: {
            Authorization: token ? `Bearer ${token}` : '',
        }
    });

    // Call the next link in the middleware chain.
    return forward(operation);
});

const errorLink = onError((error) => {

    const { graphQLErrors, networkError } = error;
    console.log('Error link', error)

    if ((networkError as any)?.statusCode === 401) {
        window.location.href = '/';
    }
    // window.location.href = '/';
    // dispatch(clearUser());
    if (graphQLErrors) graphQLErrors.map(({ message, locations, path }) => {
        console.log(`GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`);
        if (message.includes("Unauthorized")) {
            // redirect to login page or show a logout message
            window.location.href = '/login';
        }
    });
});

const client = new ApolloClient({
    link: ApolloLink.from([errorLink,  authLink.concat(httpLink)]),
    cache: new InMemoryCache(),
    // credentials: 'include',
    connectToDevTools: true
});


export default client;

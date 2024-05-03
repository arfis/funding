import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
    link: new HttpLink({
        uri: 'http://localhost:5002/graphql', // Your GraphQL endpoint
    }),
    cache: new InMemoryCache(),
    connectToDevTools: true
});

export default client;

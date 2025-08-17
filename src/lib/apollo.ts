import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { setContext } from '@apollo/client/link/context';
import { nhost } from './nhost';

const httpLink = new HttpLink({
  uri: 'https://eeycmgofhlqmoqxlhwop.hasura.ap-south-1.nhost.run/v1/graphql',
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'wss://eeycmgofhlqmoqxlhwop.hasura.ap-south-1.nhost.run/v1/graphql',
  connectionParams: () => ({
    headers: {
      Authorization: `Bearer ${nhost.auth.getAccessToken()}`,
    },
  }),
}));

const authLink = setContext((_, { headers }) => {
  const token = nhost.auth.getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
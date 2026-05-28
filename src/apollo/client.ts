import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client/core'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { getMainDefinition } from '@apollo/client/utilities'

// 1. Setup HTTP connection for standard requests (Queries & Mutations)
const httpLink = new HttpLink({
  uri: import.meta.env.VITE_HASURA_HTTP,
  headers: {
    'x-hasura-role': import.meta.env.VITE_HASURA_ROLE,
  },
})

// 2. Setup WebSocket connection for real-time live updates (Subscriptions)
const wsLink = new GraphQLWsLink(
  createClient({
    url: import.meta.env.VITE_HASURA_WS,
    connectionParams: async () => ({
      headers: {
        'x-hasura-role': import.meta.env.VITE_HASURA_ROLE,
      },
    }),
  }),
)

// 3. Automatically route traffic based on what your app is trying to do
const link = split(
  ({ query }) => {
    const def = getMainDefinition(query)
    return def.kind === 'OperationDefinition' && def.operation === 'subscription'
  },
  wsLink,
  httpLink,
)

// 4. Export the client so the rest of your app can use it
export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})
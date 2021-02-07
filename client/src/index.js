import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals'
import { ApolloClient, gql, InMemoryCache, ApolloProvider, split, from } from '@apollo/client'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { setContext } from '@apollo/client/link/context'

import jwtDecode from 'jwt-decode'

const REFRESH = gql`
  mutation RefreshToken {
    refreshToken {
      token
    }
  }
`

let client;
let token = null
let startGettingNewToken = false;

function setNewAuthToken(newToken) {
  token = newToken
}

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
  credentials: 'include',
});

const wsLink = new WebSocketLink({
  uri: " ws://localhost:4000/graphql",
  options: {
    reconnect: true
  }
});

const authLink = setContext(async (_, { headers }) => {
  if (token !== null) {
    const payload = await jwtDecode(token)

    if (Date.now() >= (payload.exp * 1000) - 5 && !startGettingNewToken) {
      try {
        startGettingNewToken = true
        const { data } = await client.mutate({
          mutation: REFRESH
        })

        setNewAuthToken(data.refreshToken.token)
        startGettingNewToken = false
      } catch (e) {
        window.location = '/auth'

        throw 'Redirect'
      }
    }
  }

  return {
    headers: {
      ...headers,
      'Access-Control-Allow-Origin': 'http://localhost:4000',
      authorization: token ? `Bearer ${token}` : '',
    }
  }
})

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

client = new ApolloClient({
  link: from([splitLink]),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App apolloSetterToken={setNewAuthToken} />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

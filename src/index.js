import { createElement as $, StrictMode } from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { ApolloProvider } from '@apollo/react-components'
import App from 'App.js'
import { split, HttpLink, ApolloClient, InMemoryCache } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/link-ws'

const httpLink = new HttpLink({
  uri: '/v1/graphql'
})

const wsLink = new WebSocketLink({
  uri: `wss://${process.env.NODE_ENV === 'development' ? 'ec2-3-15-0-177.us-east-2.compute.amazonaws.com:8080/v1/graphql' : window.location.hostname}/v1/graphql`,
  options: {
    reconnect: true
  }
})

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink,
)

const client = new ApolloClient({
  cache: new InMemoryCache({
    dataIdFromObject: ({ uid }) => uid
  }),
  link: splitLink
})

render( 
  $(StrictMode, null,
    $(ApolloProvider, { client },
      $(Router, null,
        $(App)))),
  document.getElementById('root'))
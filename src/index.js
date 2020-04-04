import { createElement as $, StrictMode } from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { ApolloProvider } from '@apollo/react-components'
import set from 'lodash/fp/set'
import App from 'App.js'
import { split, HttpLink, ApolloLink, ApolloClient, InMemoryCache } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/link-ws'
import { refreshToken as query } from 'queries'

const httpLink = new HttpLink({
  uri: '/v1/graphql',
})

const authLink = new ApolloLink((operation, forward) => {
  let authorization = localStorage.getItem('authorization')
  let expires = parseInt(localStorage.getItem('expires'))

  if (expires && expires - new Date().valueOf() < 0)
    return fetch('/v1/graphql', {
      method: 'POST',
      body: JSON.stringify({ query })
    }).then(response => response.json())
      .then(({ data }) => {
        authorization = localStorage.setItem('authorization', `Bearer ${data.refreshToken.accessToken}`)
        expires = localStorage.setItem('expires', data.refreshToken.expires * 1000)

        operation.setContext(({ headers }) =>
          set(['headers', 'Authorization'],  authorization, headers))
        forward(operation)
      })
      .catch(({ message }) => {
        console.log(message)
        localStorage.removeItem('authorization')
        localStorage.removeItem('expires')
      })
  else if (authorization) {
    operation.setContext(({ headers }) =>
      set(['headers', 'Authorization'],  authorization, headers))
    }
  return forward(operation)
})

const wsLink = new WebSocketLink({
  uri: `wss://${process.env.NODE_ENV === 'development' ? 'dev.memedic.ru' : window.location.hostname}/v1/graphql`,
  options: {
    reconnect: true
  }
})

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  authLink.concat(wsLink),
  authLink.concat(httpLink),
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
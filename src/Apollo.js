import { setContext } from 'apollo-link-context'
import { split, HttpLink, ApolloClient, InMemoryCache } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/link-ws'
import { refreshToken as query } from 'queries'

const httpLink = new HttpLink({
  uri: '/v1/graphql'
})

let refreshTokenPromise

const authLink = setContext((operation, { headers }) => {

  let authorization = localStorage.getItem('authorization')
  let expires = parseInt(localStorage.getItem('expires'))

  if (!expires || !authorization)
    return { headers }
  else if (expires - new Date().valueOf() < 0)
    return refreshTokenPromise ||
      (refreshTokenPromise = fetch('/v1/graphql', {
        method: 'POST',
        body: JSON.stringify({ query })}))
      .then(response => response.json())
      .then(response => response.errors
        ? handleError(headers)
        : response.data)
      .then(data => {
        refreshTokenPromise = null
        localStorage.setItem('authorization', `Bearer ${data.refreshToken.accessToken}`)
        localStorage.setItem('expires', data.refreshToken.expires * 1000)
        return {
          headers: {
            ...headers,
            Authorization: `Bearer ${data.refreshToken.accessToken}`,
          }
        }
      })
      .catch(handleError(headers))
  else
    return {
      headers: {
        ...headers,
        authorization
      }
    }
})

const handleError = headers => () => {
  refreshTokenPromise = null
  localStorage.removeItem('authorization')
  localStorage.removeItem('expires')
  return headers
}

export const wsLink = new WebSocketLink({
  uri: `wss://${process.env.NODE_ENV === 'development' ? 'dev.memedic.ru' : window.location.hostname}/v1/graphql`,
  options: {
    reconnect: true,
    connectionParams: () => localStorage.getItem('authorization') && {// FIXME should be dynamic
      headers: {
        Authorization: localStorage.getItem('authorization')
      }
    }
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

export const client = new ApolloClient({
  cache: new InMemoryCache({
    dataIdFromObject: ({ uid }) => uid
  }),
  link: splitLink
})

export const logoff =() => {
  localStorage.removeItem('authorization')
  localStorage.removeItem('expires')
  wsLink.subscriptionClient.client.close()
  client.resetStore()
  return true // Important
}
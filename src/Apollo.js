import { ApolloClient, InMemoryCache } from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'

import { login as loginMutation, logoff as logoffQuery, refreshToken as refreshTokenQuery } from 'queries'

const uri = '/v1/graphql'
const devUrl = 'dev.smemedic.ru'

let authPromise = null // Important to be falsey by default

const link = new WebSocketLink({
  uri: `wss://${process.env.NODE_ENV === 'development' ? devUrl : window.location.hostname}${uri}`,
  options: {
    reconnect: true,
    connectionParams: async () => {

      if (!authPromise)
        authPromise = refreshToken()
      const result = await authPromise

      if (result) {
        setTimeout(() => {
          authPromise = refreshToken()
          link.subscriptionClient.client.close()
        }, result.expiresAt - new Date().valueOf() - 20000)
        return {
          headers: {
            Authorization: `Bearer ${result.accessToken}`
          }
        }
      } else {
        return {
        }
      }
    } 
  }
})

export const client = new ApolloClient({
  queryDeduplication: true,
  defaultOptions: {
    watchQuery: { 
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first'
    }
  },
  cache: new InMemoryCache({
    dataIdFromObject: ({ uid }) => uid,
    typePolicies: {
      vshift: {
        keyFields: ['date', 'start', 'end']
      }
    }
  }),
  link: link
})

export const login = (variables) =>
  fetch(uri, {
    method: 'POST',
    body: JSON.stringify({
      query: loginMutation,
      variables
    })
  })
    .then(response => response.json())
    .then(response => {
      if (response.data.getToken)
        return handleAuth(response.data.getToken)
      throw new Error(response.errors[0].message)
    })

const refreshToken = () =>
  fetch(uri, {
    method: 'POST',
    body: JSON.stringify({ query: refreshTokenQuery })
  }).then(response => response.json())
    .then(response => response.errors
        ? (client.resetStore() && null)
        : response.data.refreshToken)
    .catch(console.log)

const handleAuth = tokenData => {
  authPromise = tokenData
  link.subscriptionClient.client.close()
  return client.resetStore()
}

export const logoff = () =>
  fetch(uri, {
    method: 'POST',
    body: JSON.stringify({ query: logoffQuery })
  }).then(response => response.json())
    .catch(console.log)
    .finally(() => {
      authPromise = {}
      link.subscriptionClient.client.close()
      return client.clearStore()
    })
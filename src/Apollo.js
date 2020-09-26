import { ApolloClient, InMemoryCache } from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'

import { refreshToken as query } from 'queries'

const uri = '/v1/graphql'
const devUrl = 'dev.memedic.ru'

let authPromise = null // Important to be falsey by default

const link = new WebSocketLink({
  uri: `wss://${process.env.NODE_ENV === 'development' ? devUrl : window.location.hostname}${uri}`,
  options: {
    reconnect: true,
    connectionParams: async () => {
      if (!authPromise)
        authPromise = refreshToken()
      const { expires, accessToken: token } = await authPromise

      if (token && expires) {
        setTimeout(() => {
          authPromise = refreshToken()
          link.subscriptionClient.client.close()
        }, (expires * 1000) - new Date().valueOf())
        return {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      } else {
        return {
          headers: {}
        }
      }
    } 
  }
})

const refreshToken = () =>
  fetch(uri, {
    method: 'POST',
    body: JSON.stringify({ query })
  }).then(response => response.json())
    .then(response => response.errors
        ? console.log(response.errors)
        : response.data)
    .then(({ refreshToken }) => refreshToken)

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

export const handleAuth = ({ data }) => {
  authPromise = data.getToken
  link.subscriptionClient.client.close()
  client.resetStore()
}

export const logoff = () => {
  authPromise = {}
  link.subscriptionClient.client.close()
  client.resetStore()
  return true // Important
}
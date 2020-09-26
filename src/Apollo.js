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
      const result = await authPromise

      if (result) {
        setTimeout(() => {
          authPromise = refreshToken()
          link.subscriptionClient.client.close()
        }, (result.expires * 1000) - new Date().valueOf())
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

const refreshToken = () =>
  fetch(uri, {
    method: 'POST',
    body: JSON.stringify({ query })
  }).then(response => response.json())
    .then(response => response.errors
        ? null
        : response.data.refreshToken)
    .catch(console.log)

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
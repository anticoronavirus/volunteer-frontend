import { createElement as $, StrictMode } from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { ApolloProvider } from '@apollo/react-components'
import ApolloClient, { InMemoryCache } from 'apollo-boost'
import App from 'App.js'

const client = new ApolloClient({
  uri: '/v1/graphql',
  cache: new InMemoryCache({
    dataIdFromObject: ({ id }) => id
  })
})

render( 
  $(StrictMode, null,
    $(ApolloProvider, { client },
      $(Router, null,
        $(App)))),
  document.getElementById('root'))
import { createElement as $, StrictMode } from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { ApolloProvider } from '@apollo/react-components'
import CssBaseline from '@material-ui/core/CssBaseline'
import ApolloClient, { InMemoryCache } from 'apollo-boost'
import App from 'App.js'

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache({
    dataIdFromObject: ({ id }) => id
  })
})

render( 
  $(StrictMode, null,
    $(ApolloProvider, { client },
      $(CssBaseline),
      $(Router, null,
        $(App)))),
  document.getElementById('root'))
import { createElement as $, StrictMode } from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { ApolloProvider } from '@apollo/react-components'
import { client } from 'Apollo'
import App from 'App.js'

render( 
  $(StrictMode, null,
    $(ApolloProvider, { client },
      $(Router, null,
        $(App)))),
  document.getElementById('root'))
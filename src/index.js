import { createElement as $, StrictMode } from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { ApolloProvider } from '@apollo/react-components'
import { client } from 'Apollo'
import App from 'App.js'

render( 
  // $(StrictMode, null,
    $(ApolloProvider, { client },
      $(Router, null,
        $(QueryParamProvider, { ReactRouterRoute: Route },
          $(App)))),
          // ),
  document.getElementById('root'))
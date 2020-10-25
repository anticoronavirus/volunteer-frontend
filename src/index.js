import { ApolloProvider } from '@apollo/client'
import { createElement as $ } from 'react'
import { render } from 'react-dom'
import { Route, BrowserRouter as Router } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'

import { client } from 'Apollo'
import App from 'App.js'

render( 
  // FIXME strict mode breaks subscriptions
  // $(StrictMode, null,
    $(ApolloProvider, { client },
      $(Router, null,
        $(QueryParamProvider, { ReactRouterRoute: Route },
          $(App)))),
          // ),
  document.getElementById('root'))
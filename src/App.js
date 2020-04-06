import { createElement as $, useMemo } from 'react'
import WithFooter from 'components/Footer'
import Main from 'Main'
import Login from 'Login'
import Hospital from 'Hospital'
import Hospitals from 'Hospitals'
import Profile from 'Profile'
import { Switch, Route, Redirect } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import { me } from 'queries'
import some from 'lodash/fp/some'
import values from 'lodash/fp/values'
import isEmpty from 'lodash/fp/isEmpty'
import { requiredProfileFields } from 'utils'

import useMediaQuery from '@material-ui/core/useMediaQuery'
import CssBaseline from '@material-ui/core/CssBaseline'
import { createMuiTheme, ThemeProvider, withStyles } from '@material-ui/core/styles'

const App = () => {

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const { data, loading } = useQuery(me)

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  )

  return $(ThemeProvider, { theme },
    $(CustomCssBaseline),
    $(WithFooter, null,
      $(Switch, null,
        $(Route, { path: '/profile', component: Profile }),
        !loading && data.me[0] && some(isEmpty, values(requiredProfileFields(data.me[0]))) &&
          $(Redirect, { to: '/profile' }),
        $(Route, { path: '/login', component: Login }),
        $(Route, { path: '/hospitals/:uid', component: Hospital }),
        $(Route, { path: '/hospitals/', component: Hospitals }),
        $(Route, { path: '/:hospitalId?', exact: true, component: Main }),
        $(Redirect, { to: '/' }))))
}

const CustomCssBaseline = withStyles(() => ({
  '@global': {
    '*::-webkit-scrollbar': {
      width: 0,
      height: 0
    },
    '*::-webkit-scrollbar-track': {
      width: 0,
      height: 0
    },
    '*::-webkit-scrollbar-thumb': {
      width: 0,
      height: 0
    }
  }
}))(CssBaseline)

export default App
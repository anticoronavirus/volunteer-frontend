import { useQuery } from '@apollo/react-hooks'
import CssBaseline from '@material-ui/core/CssBaseline'
import { createMuiTheme, ThemeProvider, withStyles } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import some from 'lodash/fp/some'
import values from 'lodash/fp/values'
import { SnackbarProvider } from 'notistack'
import { createElement as $, useMemo } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import WithFooter from 'components/Footer'
import Hospital from 'Hospital'
import Hospitals from 'Hospitals'
import Login from 'Login'
import Main from 'MainNext'
import Pages from 'Pages'
import Profile from 'Profile'
import { me } from 'queries'
import { requiredProfileFields } from 'utils'

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
    [prefersDarkMode])

  return $(ThemeProvider, { theme },
    $(CustomCssBaseline),
    loading && !data ? null :
    $(SnackbarProvider, { maxSnack: 3 },
      $(WithFooter, null,
        $(Switch, null,
          $(Route, { path: '/pages/:page', component: Pages }),
          $(Route, { path: '/profile/:page?', component: Profile }),
          !loading
            && data.me[0]
            // eslint-disable-next-line
            && some(value => value == undefined, values(requiredProfileFields(data.me[0])))
            && $(Redirect, { to: '/profile' }),
          $(Route, { path: '/login', component: Login }),
          $(Route, { path: '/hospitals/:uid/:page?', component: Hospital }),
          $(Route, { path: '/hospitals/', component: Hospitals }),
          !loading && data.me[0] &&
            $(Redirect, { to: '/profile' }),
          $(Route, { path: '/', exact: true, component: Main }),
          $(Redirect, { to: '/' })))))
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
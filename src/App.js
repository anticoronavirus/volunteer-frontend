import { createElement as $, useMemo } from 'react'
// import VolunteerForm from 'VolunteerForm'
import Main from 'Main'
import Login from 'Login'
// import AvailableShifts from 'AvailableShifts'
import Hospital from 'Hospital'
import Hospitals from 'Hospitals'
import { Switch, Route, Redirect } from 'react-router-dom'

import useMediaQuery from '@material-ui/core/useMediaQuery'
import CssBaseline from '@material-ui/core/CssBaseline'
import { createMuiTheme, ThemeProvider, withStyles } from '@material-ui/core/styles'

const App = () => {

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

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
    $(Switch, null,
      $(Route, { path: '/', exact: true, component: Main }),
      $(Route, { path: '/login', component: Login }),
      $(Route, { path: '/hospitals/:uid', component: Hospital }),
      $(Route, { path: '/hospitals/', component: Hospitals }),
      $(Redirect, { to: '/' })))
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
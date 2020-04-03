import { createElement as $, useMemo } from 'react'
// import VolunteerForm from 'VolunteerForm'
import Main from 'Main'
import Login from 'Login'
// import AvailableShifts from 'AvailableShifts'
import Hospital from 'Hospital'
import { Switch, Route, Redirect } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import { me } from 'queries'

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

  const { data } = useQuery(me)

  return $(ThemeProvider, { theme },
    $(CustomCssBaseline),
    $(Switch, null,
      $(Route, { path: '/', exact: true, component: Main }),
      ...!data || !data.me.length
        ? [$(Route, { path: '/login', component: Login })]
        : [$(Route, { path: '/hospital', component: Hospital })],
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
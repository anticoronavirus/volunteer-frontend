import { createElement as $, useMemo } from 'react'
import VolunteerForm from 'VolunteerForm'
import Main from 'Main'
import AvailableShifts from 'AvailableShifts'
import Shifts from 'Shifts'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import CssBaseline from '@material-ui/core/CssBaseline'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { Switch, Route, Redirect } from 'react-router-dom'

const App = () => {

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

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
    $(CssBaseline),
    $(Switch, null,
      $(Route, { path: '/', component: Main, exact: true }),
      $(Route, { path: `/available-shifts/${process.env.DUMB_SECRET}`, component: AvailableShifts }),
      $(Route, { path: `/shifts/${process.env.DUMB_SECRET}`, component: Shifts }),
      $(Route, { path: `/volunteer/${process.env.DUMB_SECRET}/:volunteer_id?`, component: VolunteerForm }),
      $(Redirect, { to: '/' })))
}

export default App
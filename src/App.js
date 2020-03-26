import { createElement as $, useMemo } from 'react'
import VolunteerForm from 'VolunteerForm'
import Main from 'Main'
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
      $(Route, { path: '/volunteer/:profession?/:volunteer_id?', component: VolunteerForm }),
      $(Route, { path: '/', component: Main }),
      $(Redirect, { to: '/' })))
}

export default App
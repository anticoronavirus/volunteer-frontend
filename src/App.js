import { createElement as $, useMemo } from 'react'
import VolunteerForm from 'VolunteerForm'
import Main from 'Main'
import AvailableShifts from 'AvailableShifts'
import Hospital from 'Hospital'
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
      $(Route, { path: '/hospital', component: Hospital }),
      $(Route, { path: '/', component: Main }),
      // $(Route, { path: '/', component: Main, exact: true }),
      // $(Route, { path: `/available-shifts/${"0L1lHdlBOdklHZU9"}`, component: AvailableShifts }),
      // $(Route, { path: `/shifts/${"0L1lHdlBOdklHZU9"}`, component: Shifts }),
      // $(Route, { path: `/volunteer/${"0L1lHdlBOdklHZU9"}/:volunteer_id?`, component: VolunteerForm }),
      $(Redirect, { to: '/' })))
}

export default App
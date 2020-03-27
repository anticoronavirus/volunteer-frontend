import { createElement as $, useMemo } from 'react'
import VolunteerForm from 'VolunteerForm'
import Main from 'Main'
import AvailableShifts from 'AvailableShifts'
import Shifts from 'Shifts'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import CssBaseline from '@material-ui/core/CssBaseline'
import format from 'date-fns/format'
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
      $(Route, { path: `/available-shifts-${format(new Date(), 'yyyy-MM-dd')}`, component: AvailableShifts }),
      $(Route, { path: `/shifts-${format(new Date(), 'yyyy-MM-dd')}`, component: Shifts }),
      $(Route, { path: '/volunteer/:profession?/:volunteer_id?', component: VolunteerForm }),
      $(Route, { path: '/', component: Main }),
      $(Redirect, { to: '/' })))
}

export default App
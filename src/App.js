import { createElement as $, useMemo } from 'react'
// import VolunteerForm from 'VolunteerForm'
import Main from 'Main'
// import AvailableShifts from 'AvailableShifts'
import Hospital from 'Hospital'
import { Switch, Route, Redirect } from 'react-router-dom'

import useMediaQuery from '@material-ui/core/useMediaQuery'
import CssBaseline from '@material-ui/core/CssBaseline'
import { createMuiTheme, ThemeProvider, withStyles } from '@material-ui/core/styles'

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
    $(CustomCssBaseline),
    $(Switch, null,
      $(Route, { path: '/hospital', component: Hospital }),
      $(Route, { path: '/', component: Main }),
      // $(Route, { path: '/', component: Main, exact: true }),
      // $(Route, { path: `/available-shifts/${"0L1lHdlBOdklHZU9"}`, component: AvailableShifts }),
      // $(Route, { path: `/shifts/${"0L1lHdlBOdklHZU9"}`, component: Shifts }),
      // $(Route, { path: `/volunteer/${"0L1lHdlBOdklHZU9"}/:volunteer_id?`, component: VolunteerForm }),
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
import { createElement as $ } from 'react'
import VolunteerForm from 'VolunteerForm'
import { Switch, Route } from 'react-router-dom'

const App = () =>
  $(Switch, null,
    $(Route, { path: '/volunteer', component: VolunteerForm }))

export default App
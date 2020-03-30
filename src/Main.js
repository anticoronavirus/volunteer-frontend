import { createElement as $ } from 'react'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import { useHistory } from 'react-router-dom'

const Main = () => {

  let history = useHistory()

  return $(Box, { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh' },
    $(Button, { onClick: () => history.push(`/volunteer/${"0L1lHdlBOdklHZU9"}`) }, 'Форма для волонтёров'))
}

export default Main
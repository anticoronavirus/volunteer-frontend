import { createElement as $ } from 'react'
import { useMediaQuery, useTheme } from '@material-ui/core'
import { useHistory } from 'react-router-dom'

import NavigateBefore from '@material-ui/icons/NavigateBefore'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'

const Back = () => {

  const theme = useTheme()
  const notMobile = useMediaQuery(theme.breakpoints.up('sm'))
  const history = useHistory()

  return $(Box, notMobile && { marginRight: 2, marginTop: 1.5, width: 48 },
    $(Box, notMobile && { position: 'fixed' },
      $(IconButton, { onClick: () => history.push('/') },
      $(NavigateBefore))))
}

export default Back
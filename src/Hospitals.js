import { Box, useMediaQuery, useTheme } from '@material-ui/core'
import { createElement as $ } from 'react'

import Back from 'components/Back'
import HospitalList from 'components/HospitalList'

const Hospitals = () => {

  const theme = useTheme()
  const notMobile = useMediaQuery(theme.breakpoints.up('sm'))

  return $(Box, notMobile 
    ? { display: 'flex', padding: 2 }
    : { padding: 1 },
    $(Back),
    $(Box, { margin: 'auto', flexGrow: 1, maxWidth: 480 },
      $(HospitalList)))
}

export default Hospitals
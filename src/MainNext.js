import { createElement as $, Fragment } from 'react'
import HospitalList from 'components/HospitalList'

import { styled, Box, Paper, Typography, Fade } from '@material-ui/core'

const Main = () => {
  return $(Fragment, null,
    $(Fade, { in: true },
      $(Hero, { square: true },
        $(Overlay, null,
          $(Title, { variant: 'h1' }, 'MEMEDIC')))),
    $(Box, { margin: 'auto', flexGrow: 1, maxWidth: 480 },
      $(Fade, { in: true },
        $(Typography, { align: 'center', paragraph: true },
          'Больницы участвующие в проекте')),
      $(HospitalList)))
}

const Hero = styled(Paper)({
  width: '100vw',
  height: '61.8vh',
  background: 'url(/volunteers.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center 30%',
  marginBottom: 16
})

const Overlay = styled(Box)({
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(5,40,80,.3)',
  backdropFilter: 'blur(6px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
})

const Title = styled(Typography)({})

export default Main
import { Box, Button, Fade, Paper, styled, Typography } from '@material-ui/core'
import { createElement as $, Fragment } from 'react'
import { Link } from 'react-router-dom'

import HospitalList from 'components/HospitalList'
import logo from 'logo.svg'

const Main = () =>
  $(Fragment, null,
    $(Fade, { in: true },
      $(Hero, { square: true },
        $(Overlay, null,
          $(Box, { textAlign: 'center' },
            $(Title, { variant: 'h3' }, 'MEMEDIC'),
            $(LogoImage, { src: logo, height: 32 }),
            $(Box, { paddingBottom: 1 },
              // $(Typography, { variant: 'caption' },
              //   ' Помоги больницам Москвы')
                ),
            $(Button, {
              component: Link,
              to: '/login', 
              variant: 'contained'
              },
              'Вход / Регистрация'))))),
    $(Box, { margin: 'auto', flexGrow: 1, maxWidth: 480 },
      $(Fade, { in: true },
        $(Typography, { align: 'center', paragraph: true },
          'Больницы участвующие в проекте')),
      $(HospitalList)))

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
  backgroundColor: 'rgba(5,40,80,.5)',
  backdropFilter: 'blur(6px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
})

const LogoImage = styled('img')({
  margin: 2
})

const Title = styled(Typography)({
  color: 'white'
})

export default Main
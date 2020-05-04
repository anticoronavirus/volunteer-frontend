import { createElement as $ } from 'react'
import { Link } from 'react-router-dom'
import Vkontakte from 'components/Vkontakte'

import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Email from '@material-ui/icons/Email'
import Facebook from '@material-ui/icons/Facebook'
import Telegram from '@material-ui/icons/Telegram'
import Instagram from '@material-ui/icons/Instagram'
import Box from '@material-ui/core/Box'
import { useMediaQuery, useTheme } from '@material-ui/core'
import { styled } from '@material-ui/styles'

const Footer = ({ children }) =>
  $(Box, { display: 'flex', flexDirection: 'column', minHeight: '100vh' },
    $(Box, { flexGrow: 1 }, children),
    $(Box, { height: 12 }),
    $(Box, { display: 'flex', justifyContent: 'center' }, 
        $(IconButton, { onClick: () => window.open('tg://resolve?domain=mememedic') }, $(Telegram)),
        $(IconButton, { onClick: () => window.open('https://www.facebook.com/memedic.ru/') }, $(Facebook)),
        $(IconButton, { onClick: () => window.location = 'mailto:help@memedic.ru' }, $(Email)),
      $(IconButton, { onClick: () => window.open('https://www.instagram.com/memedic_ru/') }, $(Instagram)),
      $(IconButton, { onClick: () => window.open('https://vk.com/memedic_ru') }, $(Vkontakte))),
    $(Box, { display: 'flex', justifyContent: 'center' },
      $(CustomLink, { to: '/hospitals' },
        $(Typography, { variant: 'caption', color: 'secondary' }, 'Больницы-участники')),
      $(CustomLink, { to: '/pages/volunteers' },
        $(Typography, { variant: 'caption', color: 'secondary' }, 'Волонтёрам')),
      $(CustomLink, { to: '/pages/hospitals' },
        $(Typography, { variant: 'caption', color: 'secondary' }, 'Больницам'))))

// const HelpLabel = styled(Typography)({
//   padding: 8,
//   paddingRight: 0
// })

const CustomLink = styled(Link)({
  textDecoration: 'none',
  underline: 'none',
  display: 'block',
  padding: 8,
})

export default Footer
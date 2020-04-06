import { createElement as $ } from 'react'
import { Link } from 'react-router-dom'

import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { useMediaQuery, useTheme } from '@material-ui/core'
import { styled } from '@material-ui/styles'

const Footer = ({ children }) => {

  const theme = useTheme()
  const notMobile = useMediaQuery(theme.breakpoints.up('sm'))

  return $(Box, { display: 'flex', flexDirection: 'column', minHeight: '100vh' },
    $(Box, { flexGrow: 1 }, children),
    $(Box, notMobile 
        ? { display: 'flex', justifyContent: 'center' }
        : { padding: 1 },
      $(CustomLink, { to: '/hospitals' },
        $(Typography, { variant: 'caption', color: 'secondary' }, 'Больницы-участники')),
      $(CustomLink, { to: '/hospitals' },
        $(Typography, { variant: 'caption', color: 'secondary' }, 'Волонтёрам')),
      $(CustomLink, { to: '/hospitals' },
        $(Typography, { variant: 'caption', color: 'secondary' }, 'Координаторам')),
      $(CustomLink, { href: 'mailto:help@memedic.ru'},
        $(Typography, { variant: 'caption', color: 'secondary' }, 'Обратная связь'))))
}

const CustomLink = styled(Link)({
  textDecoration: 'none',
  underline: 'none',
  display: 'block',
  padding: 8
})

export default Footer
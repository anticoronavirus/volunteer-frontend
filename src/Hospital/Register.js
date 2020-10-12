import { Box, Button, Paper, Typography } from '@material-ui/core'
import { createElement as $ } from 'react'
import { Link } from 'react-router-dom'

const Register = () => 
  $(Paper, null,
    $(Box, { padding: 2 },
      $(Typography, { variant: 'body2', paragraph: true },
        'Чтобы начать помогать этой больнице необходимо зарегистрироваться'), 
      $(Button, {
        variant: 'contained',
        color: 'primary',
        component: Link,
        to: '/login'
        },
        'Регистрация')))

export default Register
import { createElement as $, useState } from 'react'
import MaskedInput from 'react-input-mask'
import { useMutation } from '@apollo/react-hooks'
import {
  submitPhone as submitPhoneMutation,
  login as loginMutation
} from 'queries'

import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import CircularProgress from '@material-ui/core/CircularProgress'
import InputAdornment from '@material-ui/core/InputAdornment'
import Button from '@material-ui/core/Button'

const Login = () => {

  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState(null)
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [submitPhone] = useMutation(submitPhoneMutation, { variables: { phone } })
  const [login] = useMutation(loginMutation, { variables: { phone, password } })

  const handlePhone = event => {
    const nextPhone = event.target.value.replace(/[^\d]/g, '')
    setPhone(nextPhone)
    if (nextPhone.length === 11) {
      setStatus('loading')
      submitPhone()
        .then(({ submitPhone }) => setStatus(submitPhone))
        .catch(() => setStatus('failed'))
    }
    else
      setStatus(null)
  }

  const handleSubmit = () =>
    login().then(({ login }) => setToken(login))

  return $(Box, {
    margin: 'auto',
    marginTop: 5,
    maxWidth: 360,
  },
    $(Paper, null,
      $(Box, { padding: 2, paddingTop: 4 },
        $(Typography, { variant: 'h5', align: 'center' },
          'Вход/регистрация волонтёров и координаторов'),
        $(Box, { textAlign: 'center', padding: 2 }, '❤️'),
        $(TextField, {
          label: 'Телефон',
          variant: 'outlined',
          fullWidth: true,
          onChange: handlePhone,
          value: phone,
          margin: 'normal',
          type: 'phone',
          disabled: status === 'loading',
          error: status === 'failed',
          helperText: status === 'failed' &&
            'Произошла ошибка',
          InputProps: {
            inputComponent: PhoneInput,
            endAdornment: status === 'loading'
              && $(InputAdornment, { position: 'end'}, $(CircularProgress, { size: 24 }))
          }
        }),
        status === 'ok' &&
          $(TextField, {
            autoFocus: true,
            label: 'Ранее полученный пароль из SMS',
            variant: 'outlined',
            fullWidth: true,
            onChange: event => setPassword(event.target.value.replace(/[^\d]/, '')),
            value: password,
            type: 'password',
            margin: 'normal',
          }),
        password.length > 4 &&
          $(Button, { onClick: handleSubmit }, 'Войти'),
        token,
        $(Typography, { variant: 'caption' }, 'При проблемах со входом или для восстановления доступа, пишите на '),
        $(Link, { color: 'secondary', variant: 'caption', href: 'mailto:help@memedic.ru'}, 'help@memedic.ru'))))
}

const PhoneInput = other =>
  $(MaskedInput, {
    ...other,
    mask: '+7 (\\999) 999-9999',
  })

export default Login
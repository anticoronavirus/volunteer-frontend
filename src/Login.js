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

const Login = ({ history }) => {

  const [phone, setPhone] = useState('')
  const [phoneStatus, setPhoneStatus] = useState(null)
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [loginStatus, setLoginStatus] = useState(null)
  const [submitPhone] = useMutation(submitPhoneMutation, { variables: { phone } })
  const [login] = useMutation(loginMutation, { variables: { phone, password } })

  const handlePhone = event => {
    const nextPhone = event.target.value.replace(/[^\d]/g, '')
    setPhone(nextPhone)
    if (nextPhone.length === 11) {
      setPhoneStatus('loading')
      submitPhone()
        .then(({ submitPhone }) => setPhoneStatus(submitPhone))
        .catch(() => setPhoneStatus('failed'))
    }
    else
      setPhoneStatus(null)
  }

  const handleSubmit = () => {
    setLoginStatus('loading')
    login().then(({ login }) => {
      if (login.status !== 'ok')
        setLoginStatus(login.status)
      else
        localStorage.token = login.token
        history.push('/')
    }).catch(() => setLoginStatus('Произошла ошибка'))
  }

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
          disabled: phoneStatus === 'loading',
          error: phoneStatus === 'failed',
          helperText: phoneStatus === 'failed' &&
            'Произошла ошибка',
          InputProps: {
            inputComponent: PhoneInput,
            endAdornment: phoneStatus === 'loading'
              && $(InputAdornment, { position: 'end'}, $(CircularProgress, { size: 24 }))
          }
        }),
        phoneStatus === 'ok' &&
          $(TextField, {
            autoFocus: true,
            label: 'Ранее полученный пароль из SMS',
            variant: 'outlined',
            fullWidth: true,
            onChange: event => setPassword(event.target.value.replace(/[^\d]/, '')),
            value: password,
            type: 'password',
            margin: 'normal',
            error: loginStatus && loginStatus !== 'loading',
            helperText: loginStatus !== 'loading' && loginStatus
          }),
        password.length > 4 &&
          $(Box, { padding: '16px 0' },
            $(Button, {
              variant: 'outlined',
              fullWidth: true ,
              disabled: loginStatus === 'loading',
              onClick: handleSubmit },
              loginStatus === 'loading'
                ? $(CircularProgress, { size: 24 })
                : 'Войти')),
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
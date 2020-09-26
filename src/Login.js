import { useApolloClient, useMutation } from '@apollo/react-hooks'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import InputAdornment from '@material-ui/core/InputAdornment'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { createElement as $, useState } from 'react'
import MaskedInput from 'react-input-mask'

import { handleAuth } from 'Apollo'
import { login as loginMutation, submitPhone as submitPhoneMutation } from 'queries'

const Login = ({ history }) => {

  const [phone, setPhone] = useState('')
  const [phoneStatus, setPhoneStatus] = useState(null)
  const [password, setPassword] = useState('')
  const [loginStatus, setLoginStatus] = useState(null)

  const [submitPhone] = useMutation(submitPhoneMutation)
  const [login] = useMutation(loginMutation, { variables: { phone, password } })

  const handlePhone = event => {
    const nextPhone = event.target.value.replace(/[^\d]/g, '')
    if (nextPhone !== phone) {
      setPhone(nextPhone)
      if (nextPhone.length === 11) {
        setPhoneStatus('loading')
        submitPhone({ variables: { phone: nextPhone } })
          .then(({ data }) => setPhoneStatus(data.signUp.status))
          .catch(() => setPhoneStatus('failed'))
      }
      else
        setPhoneStatus(null)
    }
  }

  const handlePassword = event => {
    setLoginStatus(null)
    setPassword(event.target.value)
  }

  const handleSubmit = () => {
    setLoginStatus('loading')
    login()
      .then(handleAuth)
      .then(() => history.push('/'))
      .catch(({ message, graphQLErrors }) => // FIXME check for network errors
        setLoginStatus(graphQLErrors ? graphQLErrors[0].message : message))
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
        $('form', null, 
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
          (phoneStatus === 'ok' || phoneStatus === 'exists') &&
            $(TextField, {
              autoFocus: true,
              label: phoneStatus === 'exists'
                ? 'Ранее полученный пароль из SMS'
                : 'Пароль из SMS',
              variant: 'outlined',
              fullWidth: true,
              onChange: handlePassword,
              value: password,
              type: 'password',
              margin: 'normal',
              onKeyPress: ({ charCode }) => password.length > 3 && charCode === 13 && handleSubmit(),
              error: loginStatus && loginStatus !== 'loading',
              helperText: loginStatus !== 'loading' && loginStatus,
              inputProps: {
                autoComplete: 'current-password'
              }
            }),
          password.length > 3 &&
            $(Box, { padding: '16px 0' },
              $(Button, {
                variant: 'outlined',
                fullWidth: true ,
                disabled: loginStatus === 'loading',
                onClick: handleSubmit },
                loginStatus === 'loading'
                  ? $(CircularProgress, { size: 24 })
                  : 'Войти'))),
        $(Typography, { variant: 'caption' }, 'Смска может идти до 20 секунд. При проблемах со входом или для восстановления доступа, пишите на '),
        $(Typography, { component: 'a', color: 'secondary', variant: 'caption', href: 'mailto:help@memedic.ru'}, 'help@memedic.ru'))))
}

const PhoneInput = other =>
  $(MaskedInput, {
    ...other,
    mask: '+7 (\\999) 999-9999',
  })

export default Login
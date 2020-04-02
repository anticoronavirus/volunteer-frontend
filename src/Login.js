import { createElement as $, useState, Fragment } from 'react'
import MaskedInput from 'react-input-mask'

import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'

const Login = () => {

  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')

  return $(Box, {
    margin: 'auto',
    maxWidth: 240
  },
    $(Paper, null,
      $(Box, { padding: 2 },
        $(TextField, {
          label: 'Телефон',
          variant: 'outlined',
          fullWidth: true,
          onChange: event => setPhone(event.target.value.replace(/[^\d]/g, '')),
          value: phone,
          margin: 'normal',
          type: 'phone',
          InputProps: { inputComponent: PhoneInput }
        }),
        phone.length === 11 &&
          $(TextField, {
            autoFocus: true,
            label: 'Код из SMS',
            variant: 'outlined',
            fullWidth: true,
            onChange: event => setCode(event.target.value.replace(/[^\d]/, '')),
            value: code,
            margin: 'normal',
            InputProps: { inputComponent: CodeInput }
          }),
        code.length === 4 &&
          $(TextField, {
            autoFocus: true,
            label: 'Придумайте пароль',
            variant: 'outlined',
            fullWidth: true,
            onChange: event => setPassword(event.target.value.replace(/[^\d]/, '')),
            value: password,
            type: 'password',
            margin: 'normal'
          }))))
}

const PhoneInput = other =>
  $(MaskedInput, {
    ...other,
    mask: '+7 (\\999) 999-9999',
  })

const CodeInput = other =>
  $(MaskedInput, {
    ...other,
    mask: '9999',
  })

export default Login
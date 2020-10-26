import { useMutation } from '@apollo/client'
import { Box, Button, Paper, TextField, Typography } from '@material-ui/core'
import { Field, Form, Formik } from 'formik'
import omit from 'lodash/fp/omit'
import { createElement as $ } from 'react'
import MaskedInput from 'react-input-mask'
import { useHistory } from 'react-router-dom'

import { updateVolunteer } from 'queries'

const ProfileForm = data => {
  const [mutate] = useMutation(updateVolunteer)
  const history = useHistory()

  return $(Paper, null,
    $(Box, { padding: 2 },
      $(Formik, {
        initialValues: omit(['managedHospitals', '__typename'], data),
        // validateOnBlur: false,
        validateOnMount: true,
        onSubmit: data =>
          mutate({ variables: { data, uid: data.uid }})
            .then(() => history.push('/'))
          },
        ({ submitForm, isValid, dirty }) =>
          $(Form, null, 
            $(Field, {
              component: TextField,
              name: 'lname',
              validate: required,
              label: 'Фамилия',
              margin: 'normal',
              fullWidth: true,
              helperText: ' ',
              variant: 'outlined' }),
            $(Field, {
              component: TextField,
              name: 'fname',
              validate: required,
              label: 'Имя',
              margin: 'normal',
              fullWidth: true,
              helperText: ' ',
              variant: 'outlined' }),
            $(Field, {
              component: TextField,
              name: 'mname',
              validate: required,
              label: 'Отчество',
              margin: 'normal',
              fullWidth: true,
              helperText: ' ',
              variant: 'outlined' }),
            // $(Field, {
            //   component: FormikButtonGroup,
            //   name: 'profession' }),
            $(Field, {
              component: TextField,
              name: 'comment',
              validate: required,
              label: 'Специализация',
              margin: 'normal',
              fullWidth: true,
              helperText: ' ',
              placeholder: 'Например студент-онколог',
              variant: 'outlined' }),
            $(Field, {
              component: TextField,
              name: 'email',
              validate: value => value.match(/^([a-zA-Z0-9_\-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/) ? null : 'Введите корректную почту',
              label: 'Электронная почта',
              margin: 'normal',
              fullWidth: true,
              helperText: ' ',
              variant: 'outlined' }),
            $(Field, {
              component: TextField,
              name: 'car',
              label: 'Марка машины',
              validate: value => value && value.length > 16 && 'Сократите описание',
              margin: 'normal',
              fullWidth: true,
              helperText: ' ',
              variant: 'outlined' }),
            $(Field, {
              component: TextField,
              name: 'licenceplate',
              label: 'Номер машины',
              validate: value => value && value.trim().length < 11 && 'Заполните номер целиком, ключая регион',
              margin: 'normal',
              fullWidth: true,
              helperText: ' ',
              variant: 'outlined',
              InputProps: {
                inputComponent: LicensePlate
              } }),
            $(Box),
            isValid
              ? $(Button, {
                  onClick: submitForm,
                  variant: 'outlined',
                  fullWidth: true,
                  disabled: !dirty
                }, 'Сохранить')
              : $(Box, { padding: '8px 0' }, $(Typography, { variant: 'caption' }, 'Пожалуйста, заполните все поля'))))))
}

const LicensePlate = other =>
  $(MaskedInput, {
    ...other,
    onChange: event => {
      event.target.value = event.target.value.toUpperCase()
      other.onChange(event)
    },
    formatChars: {
      'A': '[АВЕКМНОРСТУХаверкмнорстух]',
      '9': '[0-9]',
      '?': '[0-9 ]',
    },
    maskChar: null,
    mask: 'A 999 AA 99?',
  })


const required = value => (!value || value <= 4) && 'Обязательное поле'

export default ProfileForm
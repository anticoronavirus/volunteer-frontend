import { createElement as $ } from 'react'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useMutation } from '@apollo/react-hooks'
import { useParams } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import MaskedInput from 'react-input-mask'
import { TextField } from 'formik-material-ui'
import { addVolunteer } from 'queries'
import AvailabeShifts from './AvailableShifts'

const VolunteerForm = ({ history }) => {

  const theme = useTheme()
  let { profession = 'врач' } = useParams()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))
  const [mutate, { data }] = useMutation(addVolunteer, { variables: { profession } })

  return $(Box, matches && { display: 'flex', padding: 3 },
    $(Box, { maxWidth: '60ex', flexShrink: 0 },
      $(Paper, null,
        $(Box, { padding: 3 },
          $(Typography, { variant: 'h5', paragraph: true },
            `Запись волонтеров медиков и студентов медвузов`),
            $(Typography, { variant: 'caption', paragraph: true },
              '#АнтикоронаХелп в ГКБ №40 | Пожалуйста, заполните форму и получите доступ к расписанию'),
          $(Formik, {
            initialValues,
            onSubmit: variables => mutate({ variables })
              .then(({ data }) => history.push(`/volunteer/${profession}/${data.insert_volunteer.returning[0].uid}`))
          }, ({ submitForm, isValid, dirty }) =>
            $(Form, null, 
              $(Field, {
                component: TextField,
                validate: required,
                helperText: ' ',
                variant: 'standard',
                fullWidth: true,
                margin: 'dense',
                name: 'lname',
                type: 'text',
                label: 'Фамилия'
              }),
              $(Field, {
                component: TextField,
                validate: required,
                helperText: ' ',
                variant: 'standard',
                fullWidth: true,
                margin: 'dense',
                name: 'fname',
                type: 'text',
                label: 'Имя'
              }),
              $(Field, {
                component: TextField,
                validate: required,
                helperText: ' ',
                variant: 'standard',
                fullWidth: true,
                margin: 'dense',
                name: 'mname',
                type: 'text',
                label: 'Отчество'
              }),
              $(Field, {
                component: TextField,
                validate: value => value.match(/^(\+7|7|8)?[\s-]?\(?[489][0-9]{2}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/) ? null : 'Введите корректный телефон',
                helperText: ' ',
                variant: 'standard',
                fullWidth: true,
                margin: 'dense',
                name: 'phone',
                type: 'phone',
                label: 'Телефон',
                InputProps: { inputComponent: PhoneField }
              }),
              $(Field, {
                component: TextField,
                variant: 'standard',
                validate: value => value.match(/^([a-zA-Z0-9_\-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/) ? null : 'Введите корректную почту',
                helperText: ' ',
                fullWidth: true,
                margin: 'dense',
                name: 'email',
                type: 'email',
                label: 'Email'
              }),
              data && data.insert_volunteer.returning[0].uid
                ? $(Typography, { variant: 'caption'}, `Спасибо за то, что готовы помочь! Выберите смены ${matches ? 'справа' : 'внизу'}. Галочка означает, что вы записались, а мы позвоним накануне и напомним! Если вы не уверены, не ставьте галочку, потому что другие не смогут записаться на это время.`)
                : dirty && isValid &&
                    $(Button, { onClick: submitForm, fullWidth: true, variant: 'outlined' }, 'Отправить' )))))),
    $(Box, { height: 16, minWidth: 16 }),
    data && data.insert_volunteer.returning[0].uid &&
      $(Paper, !matches && { style: { overflowX: 'scroll' }},
        $(AvailabeShifts)))
}

const PhoneField = ({
  inputRef,
  ...other
}) =>
  $(MaskedInput, {
    ...other,
    mask: '+7 (\\999) 999-9999',
  })

// const professions = {
//   'врач': 'врачей',
//   'медсестра': 'медсестёр',
//   'водитель': 'водителей',
// }

const initialValues = {
  lname: '', 
  mname: '', 
  fname: '', 
  phone: '', 
  email: '', 
}

const required = value => !value && 'Обязательное поле'

export default VolunteerForm
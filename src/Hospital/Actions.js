import { createElement as $ } from 'react'
import map from 'lodash/fp/map'
import merge from 'lodash/fp/merge'
import omit from 'lodash/fp/omit'
import entries from 'lodash/fp/entries'
import { useApolloClient } from '@apollo/react-hooks'
import generateXlsx from 'zipcelx'
import { exportShifts, exportCars } from 'queries'

import Tooltip from '@material-ui/core/Tooltip'
import Box from '@material-ui/core/Box'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import CloudDownload from '@material-ui/icons/CloudDownload'
import DriveEta from '@material-ui/icons/DriveEta'

const Actions = ({ hospitalId, shortname }) => {
  const client = useApolloClient()
  return $(Box, { display: 'flex', justifyContent: 'center' },
    $(ButtonGroup, null,
      $(Button, { onClick: () =>
          client.query({ query: exportShifts, variables: { hospitalId } })
            .then(result => generateXlsx({
              filename: `Заявки волонтёров ${shortname}`,
              sheet: {
                data: [
                  headers,
                  ...map(formatShift, result.data.volunteer_shift)]
              }
            })) },
        $(Tooltip, { title: 'Выгрузка подтверждённых смен в Excel' },
          $(CloudDownload, { fontSize: 'small' }))),
      $(Button, { onClick: () =>
        client.query({ query: exportCars, variables: { hospitalId } })
          .then(result => generateXlsx({
            filename: `Номера машин волонтёров в ${shortname}`,
            sheet: {
              data: [
                carHeaders,
                ...map(formatCar, result.data.volunteer_shift)]
            }
          })) },
      $(Tooltip, { title: 'Выгрузка номеров машин подтверждённых волонтёров' },
        $(DriveEta, { fontSize: 'small' })))))
}

const carHeaders = map(value => ({ value, type: 'string' }), [
  'фамилия',
  'имя',
  'отчество',
  'марка машины',
  'номер машины'
])

const headers = map(value => ({ value, type: 'string' }), [
  'дата',
  'начало смены',
  'конец смены',
  'подтверждён',
  'фамилия',
  'имя',
  'отчество',
  'телефон',
  'профессия',
  'электронная почта',
  'документы предоставлены'
])

const formatShift = shift => 
  map(formatValue, entries(omit(['volunteer', '__typename'], merge(shift, shift.volunteer))))

const formatValue = ([key, value]) => ({
  value: customFormats[key]
    ? customFormats[key](value)
    : value,
  type: 'string' })

const customFormats = {
  confirmed: value => value ? 'Да' : 'Нет',
  start: value => value.slice(0, 5),
  end: value => value.slice(0, 5),
  provisioned_documents: value => value.length ? 'Да' : 'Нет'
}

const formatCar = ({ volunteer }) =>
  map(formatCarValue, entries(volunteer))

const formatCarValue = ([key, value]) => ({
  value,
  type: 'string'
})

export default Actions
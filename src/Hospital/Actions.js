import { createElement as $ } from 'react'
import map from 'lodash/fp/map'
import merge from 'lodash/fp/merge'
import omit from 'lodash/fp/omit'
import entries from 'lodash/fp/entries'
import { useApolloClient } from '@apollo/react-hooks'
import generateXlsx from 'zipcelx'
import { exportShifts } from 'queries'

import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import CloudDownload from '@material-ui/icons/CloudDownload'

const Actions = ({ hospitalId, shortname }) => {
  const client = useApolloClient()
  return $(ButtonGroup, null,
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
      $(CloudDownload, { fontSize: 'small' })))
}

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

export default Actions
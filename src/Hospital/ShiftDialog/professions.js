import { createElement as $ } from 'react'
import { useQuery } from '@apollo/react-hooks'
import {
  professions as professionsQuery,
} from 'queries'
import map from 'lodash/fp/map'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import find from 'lodash/fp/find'
import TaskOption from 'components/TaskOption'

export default ({
  selected,
  onChange
}) => {
  const professionsResult = useQuery(professionsQuery)

  return !professionsResult.loading && professionsResult.data &&
    $(FormControl, { variant: 'outlined', style: { width: '100%'} },
      $(InputLabel, null, 'Профессия'),
      $(Select, {
        value: selected,
        onChange: event => {
          onChange(find({ uid: event.target.value }, professionsResult.data.professions))
        },
        label: 'Профессия',
        renderValue: selected =>
          $(Selected, { ...find({ uid: selected }, professionsResult.data.professions) })
      },
        map(profession =>
          TaskOption({
            onClick: () => {},
            ...profession
          }),
          professionsResult.data.professions)))
}

const Selected = ({ name }) => {
  return $('div', null, name)
}

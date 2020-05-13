import { createElement as $ } from 'react'
import { useQuery } from '@apollo/react-hooks'
import {
  professions as professionsQuery,
} from 'queries'
import map from 'lodash/fp/map'
import find from 'lodash/fp/find'
import TaskOption from 'components/TaskOption'
import TextField from '@material-ui/core/TextField'

export default ({
  selected,
  onChange
}) => {
  const professionsResult = useQuery(professionsQuery)

  return !professionsResult.loading && professionsResult.data &&
    $(TextField, {
      value: selected,
      onChange: event => {
        onChange(find({ uid: event.target.value }, professionsResult.data.professions))
      },
      select: true,
      label: 'Профессия',
      variant: 'outlined',
      fullWidth: true,
      SelectProps: {
        renderValue: selected =>
          $(Selected, { ...find({ uid: selected }, professionsResult.data.professions) })
        }
    },
      map(profession =>
        TaskOption({
          onClick: () => {},
          ...profession
        }),
        professionsResult.data.professions))
}

const Selected = ({ name }) => {
  return $('div', null, name)
}

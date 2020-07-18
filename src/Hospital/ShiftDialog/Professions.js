import { createElement as $, memo } from 'react'
import { useQuery } from '@apollo/react-hooks'
import {
  professions as professionsQuery,
} from 'queries'
import map from 'lodash/fp/map'
import find from 'lodash/fp/find'
import TaskOption from 'components/TaskOption'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'
import Box from '@material-ui/core/Box'

const Professions = ({
  selected,
  onChange
}) => {
  const { data, loading } = useQuery(professionsQuery)

  return $(TextField, {
      value: selected,
      onChange: event => {
        onChange(find({ uid: event.target.value }, data.professions))
      },
      select: true,
      label: 'Профессия',
      variant: 'outlined',
      fullWidth: true,
      disabled: !data && loading,
      SelectProps: {
        ...!data && loading && { IconComponent },
        renderValue: () => $(Selected, selected)
      }
    },
      data &&
        map(profession =>
          TaskOption({
            onClick: () => {},
            ...profession
          }),
          data.professions))
}

const IconComponent = () => $(Box, { paddingRight: 1.5, paddingTop: 1, }, $(CircularProgress, { size: 16 }))

const Selected = ({ name }) => {
  return $('div', null, name)
}

export default memo(Professions)

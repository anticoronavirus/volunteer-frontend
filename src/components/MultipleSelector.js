import { createElement as $ } from 'react'
import { Query } from '@apollo/react-components'
import get from 'lodash/fp/get'
import map from 'lodash/fp/map'
import find from 'lodash/fp/find'
// import includes from 'lodash/fp/includes'
// import without from 'lodash/fp/without'

import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'

const MultipleSelector = ({
  value,
  onChange,
  query,
  label,
  emptyLabel,
  path,
  getOptionLabel,
  getOptionValue
}) =>
  $(Query, { query }, ({ data, loading }) => {

    const options = get(path, data)
    const selectedLabel = value && options && getOptionLabel(find(option => value === getOptionValue(option), options))
    const Option = option => $(MenuItem, { value: getOptionValue(option) }, getOptionLabel(option))

    return $(FormControl, null,//{ fullWidth: true }, 
      $(Select, {
        value,
        // fullWidth: true,
        disabled: loading,
        displayEmpty: true,
        onChange: (event, { props }) => onChange(
          props.value === value
            ? undefined
            : props.value
        ),
          // includes(props.value, value)
          //   ? value.length === 1
          //     ? undefined // This is needed to clear the param
          //     : without([props.value], value)
          //   : [...value, props.value]),
        // multiple: true,
        renderValue: selected => !selected || !options
          ? emptyLabel
          : `${label}: ${selectedLabel}`, //`${label}: ${selected.join(', ')}`,
        disableUnderline: true,
      },
      data && map(Option, options)))
  })

export default MultipleSelector
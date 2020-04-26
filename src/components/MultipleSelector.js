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
  variables,
  path,
  getOptionLabel,
  getOptionValue,
  defaultValue,
  ...rest
}) =>
  $(Query, { query, variables }, ({ data, loading }) => {

    let options = get(path, data)
    if (options && defaultValue)
      options = [defaultValue, ...options]

    const selectedLabel = value && options && getOptionLabel(find(option => value === getOptionValue(option), options))
    const Option = rest.Option || (option => $(MenuItem, { key: getOptionValue(option), value: getOptionValue(option) }, getOptionLabel(option)))

    return $(FormControl, null,//{ fullWidth: true }, 
      $(Select, {
        value,
        // fullWidth: true,
        disabled: loading,
        displayEmpty: true,
        onChange: (event, { props }) => onChange(props.value),
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
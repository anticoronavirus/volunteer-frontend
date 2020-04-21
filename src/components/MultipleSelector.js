import { createElement as $ } from 'react'
import { Query } from '@apollo/react-components'
import get from 'lodash/fp/get'
import map from 'lodash/fp/map'
import includes from 'lodash/fp/includes'
import without from 'lodash/fp/without'

import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'

const MultipleSelector = ({
  value = [],
  onChange,
  query,
  label,
  emptyLabel,
  path,
  getOptionLabel,
  getOptionValue
}) =>
  $(Query, { query }, ({ data, loading }) =>
    $(FormControl, null,//{ fullWidth: true }, 
      $(Select, {
        value,
        // fullWidth: true,
        disabled: loading,
        displayEmpty: true,
        onChange: (event, { props }) => onChange(
          includes(props.value, value)
            ? without([props.value], value)
            : [...value, props.value]),
        multiple: true,
        renderValue: selected => !selected.length
          ? emptyLabel
          : `${label}: ${selected.join(', ')}`,
        disableUnderline: true,
      },
      data && map(option => $(MenuItem, { value: getOptionValue(option) }, getOptionLabel(option)),
        get(path, data)))))

export default MultipleSelector
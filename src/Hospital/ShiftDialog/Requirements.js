import { createElement as $, memo } from 'react'
import Chip from '@material-ui/core/Chip'
import { useQuery } from '@apollo/react-hooks'
import {
  requirements as requirementsQuery
} from 'queries'
import map from 'lodash/fp/map'

import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'
import MenuItem from '@material-ui/core/MenuItem'
import { styled } from '@material-ui/core/styles'

const Requirements = ({
  hospitalId,
  professionId,
  value,
  onChange = console.log
}) => {

  const { data, loading } = useQuery(requirementsQuery, {
    variables: {
      where: {
        hospital_id: { _eq: hospitalId  },
        profession_id: { _eq: professionId }
      }
    }})

  return $(TextField, {
    onChange,
    size: value && value.length && 'small',
    value: map('requirement.uid', value),
    select: true,
    label: 'Обязательные условия',
    variant: 'outlined',
    fullWidth: true,
    disabled: !data && loading,
    SelectProps: {
      multiple: true,
      ...!data && loading && { IconComponent },
      renderValue: () => map(SelectedRequirement, value)
    },
  },
    data &&
      map(Requirement, data.requirements))
}

const IconComponent = () => $(Box, { paddingRight: 1.5, paddingTop: 1, }, $(CircularProgress, { size: 16 }))

const SelectedRequirement = ({ uid, requirement }) =>
  $(StyledChip, { key: uid, label: requirement.name })

const Requirement = ({ name, uid }) =>
  $(MenuItem, { key: uid, value: uid }, name)

const StyledChip = styled(Chip)({ margin: 1 })

export default memo(Requirements)

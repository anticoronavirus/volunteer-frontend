import { createElement as $, memo } from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import Chip from '@material-ui/core/Chip'
import { useQuery } from '@apollo/react-hooks'
import {
  requirements as requirementsQuery
} from 'queries'
import map from 'lodash/fp/map'
import Box from '@material-ui/core/Box'
import { styled } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

const Requirements = ({
  hospitalId,
  professionId,
  value,
  onChange = console.log
}) => {

  const requirementsResult = useQuery(requirementsQuery, {
    variables: {
      where: {
        hospital_id: { _eq: hospitalId  },
        profession_id: { _eq: professionId }
      }
    }})

  return $(Box, { marginTop: 3 },
    $(TextField, {
      onChange,
      size: value && value.length && 'small',
      value: map('requirement.uid', value),
      select: true,
      label: 'Обязательные условия',
      variant: 'outlined',
      fullWidth: true,
      SelectProps: {
        multiple: true,
        renderValue: () => map(SelectedRequirement, value)
      },
    },
      requirementsResult.data &&
        map(Requirement, requirementsResult.data.requirements)))
}

const SelectedRequirement = ({ uid, requirement }) =>
  $(StyledChip, { key: uid, label: requirement.name })

const Requirement = ({ name, uid }) =>
  $(MenuItem, { key: uid, value: uid }, name)

const StyledChip = styled(Chip)({ margin: 1 })

export default memo(Requirements)

import { createElement as $, useState} from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import Chip from '@material-ui/core/Chip'
import { useQuery } from '@apollo/react-hooks'
import {
  requirements as requirementsQuery
} from 'queries'
import map from 'lodash/fp/map'
import get from 'lodash/fp/get'
import Box from '@material-ui/core/Box'
import { styled } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

const Requirements = ({
  hospitalId,
  professionId,
  onChange
}) => {
  const requirementsResult = useQuery(requirementsQuery, { skip: !professionId, variables: {
    where: {
      hospital_id: { _eq: hospitalId  },
      profession_id: { _eq: professionId }
    }
  }})

  const [requirements, setRequirements] = useState([])

  const handleChange = (event) => {
    setRequirements(event.target.value)
    onChange(map(get('uid'), event.target.value))
  }
  return !requirementsResult.loading && requirementsResult.data &&
    $(Box, { marginTop: 3 },
      $(TextField, {
        value: requirements,
        onChange: handleChange,
        select: true,
        label: 'Обязательные условия',
        variant: 'outlined',
        fullWidth: true,
        SelectProps: {
          multiple: true,
          renderValue: selected =>
            $(Chips, null,
              map(requirement =>
                $(StyledChip, { key: requirement.uid, label: requirement.name }),
                selected
            ))
        },
      },
        map(requirement =>
          $(MenuItem, { key: requirement.uid, value: requirement }, requirement.name),
          requirementsResult.data.requirements
        )))
}

Requirements.defaultProps = {
  onChange: () => {}
}

const Chips = styled('div')({
  display: 'flex',
  flexWrap: 'wrap'
})

const StyledChip = styled(Chip)({ margin: 3 })

export default Requirements

import { useMutation } from '@apollo/client'
import { Delete, Restore } from '@material-ui/icons'
import { createElement as $ } from 'react'
import { IconButton } from '@material-ui/core'

import { setCancelShift } from 'queries'

const ToggleCancelShift = ({ uid, is_cancelled }) => {
  const [mutate] = useMutation(setCancelShift, {
    ignoreResults: true,
    variables: {
      uid,
      is_cancelled: !is_cancelled
    },
    optimisticResponse: {
      __typename: 'Mutation',
      setCancelShift: {
        __typename: 'volunteer_shift',
        uid,
        is_cancelled: !is_cancelled
      }
    }
  })
  return $(IconButton, { onClick: mutate },
    is_cancelled
      ? $(Restore)
      : $(Delete))
}

export default ToggleCancelShift
import { createElement as $ } from 'react'
import { useSubscription } from '@apollo/react-hooks'
import addDays from 'date-fns/addDays'
import {
  shifts,
} from 'queries'

const now = new Date()

const Shifts = () => {

  const { data } = useSubscription(shifts, {
    variables: {
      from: now,
      to: addDays(now, 14)
    }
  })

  return 'Shifts'
}

export default Shifts
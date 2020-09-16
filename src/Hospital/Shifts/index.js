import { createElement as $, useContext } from 'react'

import HospitalContext from '../HospitalContext'
import ManagedShifts from './ManagedShifts'
import VolunteerView from './VolunteerView'

const ShiftList = () => {
  const { hospitalId, isManagedByMe } = useContext(HospitalContext)
  
  return isManagedByMe
    ? $(ManagedShifts, { hospitalId })
    : $(VolunteerView, { hospitalId })
}

export default ShiftList
import { createElement as $, useContext } from 'react'

import HospitalContext from '../HospitalContext'
import VolunteerView from './VolunteerView'

const ShiftList = () => {
  const { hospitalId, isManagedByMe } = useContext(HospitalContext)
  
  return isManagedByMe
    ? $('div', null, 'shifts')
    : $(VolunteerView, { hospitalId })
}

export default ShiftList
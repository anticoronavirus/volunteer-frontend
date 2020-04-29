import { createElement as $ } from 'react'

const Directions = () =>
  data && (data.hospital.directions || isManagedByMe) &&
    $(Box, { marginTop: 2 },
    $(Paper, null,
      $(HowToGet, {
        uid: data.hospital.uid,
        editable: isManagedByMe,
        directions: data.hospital.directions })))

export default Directions
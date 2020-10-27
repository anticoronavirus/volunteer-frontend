import { useQuery } from '@apollo/client'
import { Card, CardActionArea, CardContent, Fade, styled, Typography } from '@material-ui/core'
import { createElement as $ } from 'react'
import { Link } from 'react-router-dom'

import { hospitals } from 'queries'
import { uncappedMap } from 'utils'

const Hospitals = () => {

  const { data } = useQuery(hospitals)

  return !data
    ? null
    : uncappedMap(Hospital, data.hospital)
}

export const Hospital = ({
  uid,
  shortname,
  address
}, index) =>
  $(Fade, { in: true, key: uid, timeout: index * 300 },
    $(HospitalLink, { to: `/hospitals/${uid}` },
      $(Card, null,
        $(CardActionArea, null, 
          // $(HospitalImage, { image: `https://picsum.photos/480/140?random=${uid}` }),
          $(CardContent, null,
            $(Typography, { variant: 'h5' }, shortname),
            $(Typography, { variant: 'body1' }, address ))))))

const HospitalLink = styled(Link)({
  display: 'block',
  marginBottom: '16px',
  textDecoration: 'inherit',
  color: 'inherit',
})

export default Hospitals
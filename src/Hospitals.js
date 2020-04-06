import { createElement as $ } from 'react'
import { Query } from '@apollo/react-components'
import { hospitals } from 'queries'
import map from 'lodash/fp/map'
import Back from 'components/Back'
import { useMediaQuery, useTheme } from '@material-ui/core'
import { Link } from 'react-router-dom'

import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
// import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import { styled } from '@material-ui/styles'

const Hospitals = () => {

  const theme = useTheme()
  const notMobile = useMediaQuery(theme.breakpoints.up('sm'))

  return $(Query, { query: hospitals }, ({ data }) =>
    $(Box, notMobile 
        ? { display: 'flex', padding: 2 }
        : { padding: 1 },
      $(Back),
      $(Box, { margin: 'auto', flexGrow: 1, maxWidth: 480 },
        data &&
          map(Hospital, data.hospitals))))
}

const Hospital = ({
  uid,
  shortname,
  address
}) =>
  $(HospitalLink, { to: `/hospitals/${uid}` },
    $(Card, { key: uid },
      $(CardActionArea, null, 
        // $(HospitalImage, { image: `https://picsum.photos/480/140?random=${uid}` }),
        $(CardContent, null,
          $(Typography, { variant: 'h5' }, shortname),
          $(Typography, { variant: 'body1' }, address )))))

const HospitalLink = styled(Link)({
  display: 'block',
  marginBottom: '16px',
  textDecoration: 'inherit',
  color: 'inherit',
})

// const HospitalImage = styled(CardMedia)({
//   height: 140
// })

export default Hospitals
import { Box, Paper, styled, Typography } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import { createElement as $ } from 'react'

import Back from 'components/Back'
import { useIsDesktop } from 'utils'

const Header = ({
  loading,
  children,
  hospital
}) => {

  const isDesktop = useIsDesktop()

  return $(Paper, null,
    $(Back, { marginTop: 0 }),
    $(Box, isDesktop && { display: 'flex', alignItems: 'center', flexDirection: 'column' }, 
      $(Box, { padding: 3 },
        $(Typography, { variant: 'h4', align: 'center' }, loading && !hospital
          ? $(CustomSkeleton, { width: '6ex'})
          : hospital.shortname),
        $(Typography, { variant: 'subtitle2', align: 'center' }, loading && !hospital
          ? $(CustomSkeleton, { width: '20ex' })
          : hospital.name)),
      children))
}

const CustomSkeleton = styled(Skeleton)({
  display: 'inline-block'
})

export default Header
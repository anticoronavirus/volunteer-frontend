import { ListSubheader, styled } from '@material-ui/core'

const SubheaderWithBackground = styled(ListSubheader)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper
}))

export default SubheaderWithBackground
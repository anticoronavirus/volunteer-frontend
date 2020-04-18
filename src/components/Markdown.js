import { createElement as $ } from 'react'
import ReactMarkdown from 'react-markdown'

import Typography from '@material-ui/core/Typography'
import { styled } from '@material-ui/core/styles'

const Markdown = ({ source }) =>
  $(ReactMarkdown, { source, renderers })
  
const renderers = {
  heading: ({ level, children }) =>
    $(Typography, { variant: `h${level}` }, children),
  paragraph: ({ children }) =>
    $(Typography, { variant: `body1` }, children),
  image: props => $(Image, props)
}

const Image = styled('img')({
  width: '100%',
})

export default Markdown
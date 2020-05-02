import { createElement as $ } from 'react'
import ReactMarkdown from 'react-markdown'

import Typography from '@material-ui/core/Typography'
import { styled } from '@material-ui/core/styles'

const Markdown = ({ source }) =>
  $(ReactMarkdown, { source, renderers })
  
const renderers = {
  heading: ({ level, children }) =>
    $(Typography, { variant: `h${level + 2}`, paragraph: true }, children),
  paragraph: ({ children }) =>
    $(Typography, { variant: `body1`, paragraph: true }, children),
  image: props => $(Image, props),
  listItem: ({ children }) =>
    $(Typography, { variant: `body1`, component: 'li' }, children)
}

const Image = styled('img')({
  width: '100%',
})

export default Markdown
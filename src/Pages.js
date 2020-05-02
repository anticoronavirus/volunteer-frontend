import { createElement as $ } from 'react'
import Back from 'components/Back'
import MarkdownWithPreview from 'components/MarkdownWithPreview'
import { Redirect } from 'react-router-dom'
import { useIsDesktop } from 'utils'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { page, updatePage } from 'queries'

import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'

const Pages = ({
  match
}) => {

  const isDekstop = useIsDesktop()
  const { data } = useQuery(page, { variables: { name: match.params.page }})
  const [update] = useMutation(updatePage, {
    update: (store, { data }) =>
      store.writeQuery({
        query: page,
        variables: { name: match.params.page },
        data: {
          page: data.insert_page.returning
        }
      }),
    variables: { name: match.params.page }})

  return $(Box, isDekstop && { display: 'flex', padding: 2 },
    $(Back),
    data && data.page.length === 0 &&
      $(Redirect, { to: '/'}),
    $(Box, { margin: 'auto', marginTop: 2, minWidth: '70ex' },
    $(Paper, null,
      data && data.page[0] &&
        $(Box, { padding: 2 },
          $(MarkdownWithPreview, {
            onChange: content => update({
              variables: { content },
              optimisticResponse: {
                insert_page: {
                  returning: [{
                    uid: Math.random,
                    content,
                    __typename: 'page'
                  }]
                }
              }
            }),
            content: data.page[0].content})))))
}

export default Pages
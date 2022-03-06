import Avatar from './Avatar'
import { mount } from '@cypress/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import '../../App.css'

describe('Avatar', () => {
  let queryClient

  beforeEach(() => {
    queryClient = new QueryClient()
  })

  // testing this at component level is limited, have to go up a level
  it('should render', () => {
    mount(
      <QueryClientProvider client={queryClient}>
        <Avatar src={`src`} fallbackSrc={`fallbackSrc`} />
      </QueryClientProvider>
    )
    cy.get('img')
      .should('be.visible')
      .and('have.attr', 'alt')
      .should('eq', 'Fallback Avatar')
  })
})

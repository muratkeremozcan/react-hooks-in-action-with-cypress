import BookablesView from './BookablesView'
import PageSpinner from '../UI/PageSpinner'
import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { mount } from '@cypress/react'
import '../../App.css'

describe('BookablesView', { viewportWidth: 700, viewportHeight: 700 }, () => {
  const queryClient = new QueryClient()

  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3001/bookables', {
      fixture: 'bookables'
    }).as('bookablesStub')

    mount(
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<PageSpinner />}>
          <BrowserRouter>
            <BookablesView />
          </BrowserRouter>
        </Suspense>
      </QueryClientProvider>
    )
  })

  it('should render the children: BookablesList and BookableDetails ', () => {
    cy.getByCy('bookables-list').should('be.visible')
    cy.getByCy('bookable-details').should('be.visible')
  })

  // @FF_prevNextBookable
  // https://github.com/cypress-io/cypress/issues/18662
  // Stubbing modules isn't working in the component runner. The same thing is ok in the e2e runner. Wait for Cy 10
  // TODO: once stubbing works in Cypress 10, try to stub the LaunchDarkly hook
  // https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/stubbing-spying__functions
  /*

  import * as LD from 'launchdarkly-react-client-sdk'

  cy.stub(LD, 'useFlags).returns({ 'pre-next-bookable': {
      "Next": true,
      "Previous": true
    }
  })

  */
  it.skip('should switch to the next bookable and keep cycling with next button', () => {
    cy.getByCy('next-btn').click()
    cy.location('pathname').should('eq', '/bookables/2')
  })

  it('selects the other dropdown list of items', () => {
    Cypress.on('uncaught:exception', () => false)
    cy.get('select').select(1)
    cy.location('pathname').should('eq', '/bookables/5')
  })

  it('should nav to new bookable component on New', () => {
    cy.getByCy('new-bookable').click()
    cy.location('pathname').should('eq', '/bookables/new')
  })
})

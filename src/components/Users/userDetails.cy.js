import { Suspense } from 'react'
import PageSpinner from '../UI/PageSpinner'
import ErrorComp from '../UI/ErrorComp'
import { QueryClient, QueryClientProvider } from 'react-query'
import { mount } from '@cypress/react'
import { ErrorBoundary } from 'react-error-boundary'
import UserDetails from './UserDetails'
import '../../App.css'
const users = require('../../../cypress/fixtures/users.json')

describe('UserDetails', { viewportWidth: 700, viewportHeight: 700 }, () => {
  let queryClient
  beforeEach(() => (queryClient = new QueryClient()))

  it('should not display anything without a user', () => {
    Cypress.on('uncaught:exception', () => false)
    cy.clock()

    cy.intercept('GET', 'http://localhost:3001/users/*').as('notFound')

    mount(
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary fallback={<ErrorComp />}>
          <Suspense fallback={<PageSpinner />}>
            <UserDetails />
          </Suspense>
        </ErrorBoundary>
      </QueryClientProvider>
    )
    cy.getByCy('spinner').should('be.visible')

    Cypress._.times(4, () => {
      cy.tick(5000)
      cy.wait('@notFound')
    })
    cy.tick(5000)

    cy.getByCy('error').should('be.visible')
  })

  it('should display the user', () => {
    const index = 1
    cy.intercept('GET', 'http://localhost:3001/users/*', {
      body: users[index]
    }).as('userStub')

    mount(
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<PageSpinner />}>
          <UserDetails user={users[index]} />
        </Suspense>
      </QueryClientProvider>
    )
    cy.getByCy('spinner').should('be.visible')
    cy.getByCy('user-details').should('be.visible')
    cy.get('img').should('be.visible')
  })
})

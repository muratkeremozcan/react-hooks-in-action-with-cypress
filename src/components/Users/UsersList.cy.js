import UsersList from './UsersList'
import { mount } from '@cypress/react'
import PageSpinner from '../UI/PageSpinner'
import ErrorComp from '../UI/ErrorComp'
import { Suspense } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ErrorBoundary } from 'react-error-boundary'
import '../../App.css'
const users = require('../../../cypress/fixtures/users.json')

describe('UsersList', { viewportWidth: 700, viewportHeight: 700 }, () => {
  let queryClient

  beforeEach(() => {
    queryClient = new QueryClient()
  })

  it('should render spinner preload, and set a user as default', () => {
    cy.intercept(
      {
        method: 'GET',
        url: 'http://localhost:3001/users'
      },
      {
        delay: 100,
        fixture: 'users'
      }
    ).as('userStubDelayed')

    mount(
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<PageSpinner />}>
          <UsersList user={users[1]} setUser={cy.spy().as('setUser')} />
        </Suspense>
      </QueryClientProvider>
    )

    cy.getByCy('spinner').should('be.visible')
    cy.wait('@userStubDelayed')
    cy.getByCy('spinner').should('not.exist')
  })

  it('should highlight the selected user on initial load', () => {
    cy.intercept('GET', 'http://localhost:3001/users', {
      fixture: 'users'
    }).as('userStub')

    mount(
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<PageSpinner />}>
          <UsersList user={users[1]} setUser={cy.spy().as('setUser')} />
        </Suspense>
      </QueryClientProvider>
    )
    cy.wait('@userStub')

    cy.checkBtnColor(1, 'rgb(23, 63, 95)')
    cy.checkBtnColor(0, 'rgb(255, 255, 255)')
  })

  it('should render error', () => {
    cy.intercept(
      {
        method: 'GET',
        url: 'http://localhost:3001/users'
      },
      { statusCode: 500 }
    ).as('networkError')

    Cypress.on('uncaught:exception', () => false)

    cy.clock()
    mount(
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary fallback={<ErrorComp />}>
          <Suspense fallback={<PageSpinner />}>
            <UsersList user={users[1]} />
          </Suspense>
        </ErrorBoundary>
      </QueryClientProvider>
    )

    Cypress._.times(4, () => {
      cy.tick(5000)
      cy.wait('@networkError')
    })
    cy.getByCy('error').should('exist')
  })

  context('feature flag next prev', () => {
    it('should highlight the selected user on initial load', () => {
      cy.intercept('GET', 'http://localhost:3001/users', {
        fixture: 'users'
      }).as('userStub')

      mount(
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<PageSpinner />}>
            <UsersList user={users[1]} setUser={cy.spy().as('setUser')} />
          </Suspense>
        </QueryClientProvider>
      )
      cy.wait('@userStub')

      cy.getByCy('next-btn').click()
      cy.getByCy('prev-btn').click()
      cy.get('@setUser').should('have.been.calledTwice')
    })
  })
})

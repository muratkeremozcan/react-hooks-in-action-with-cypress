import { mount } from '@cypress/react'
import UsersList from './UsersList'
import { QueryClient, QueryClientProvider } from 'react-query'
import '../../App.css'
const users = require('../../../cypress/fixtures/users.json')

describe('UsersList', { viewportWidth: 700, viewportHeight: 700 }, () => {
  const queryClient = new QueryClient()

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
        <UsersList user={users[1]} setUser={cy.spy().as('setUser')} />
      </QueryClientProvider>
    )

    cy.getByCy('spinner').should('be.visible')
    cy.wait('@userStubDelayed')
    cy.getByCy('spinner').should('not.exist')
  })

  it('should render error', () => {
    cy.intercept(
      {
        method: 'GET',
        url: 'http://localhost:3001/users'
      },
      { statusCode: 500 }
    ).as('networkError')

    mount(
      <QueryClientProvider client={queryClient}>
        <UsersList user={users[1]} />
      </QueryClientProvider>
    )

    Cypress._.times(4, () => cy.wait('@networkError', { timeout: 10000 }))
    cy.getByCy('error').should('exist')
  })

  it('should highlight the selected user on initial load', () => {
    cy.intercept('GET', 'http://localhost:3001/users', {
      fixture: 'users'
    }).as('userStub')

    mount(
      <QueryClientProvider client={queryClient}>
        <UsersList user={users[1]} setUser={cy.spy().as('setUser')} />
      </QueryClientProvider>
    )
    cy.wait('@userStub')

    cy.checkBtnColor(1, 'rgb(23, 63, 95)')
    cy.checkBtnColor(0, 'rgb(255, 255, 255)')
  })
})

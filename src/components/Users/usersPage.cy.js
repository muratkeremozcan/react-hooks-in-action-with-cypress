import { mount } from '@cypress/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Suspense } from 'react'
import UsersPage from './UsersPage'
import PageSpinner from '../UI/PageSpinner'
import UserContext from './UserContext'
import '../../App.css'
const users = require('../../../cypress/fixtures/users.json')

describe('UserDetails', { viewportWidth: 700, viewportHeight: 700 }, () => {
  let queryClient

  const initialIndex = 1

  beforeEach(() => {
    queryClient = new QueryClient()

    cy.intercept('GET', 'http://localhost:3001/users', {
      fixture: 'users'
    }).as('userStub')

    cy.intercept('GET', 'http://localhost:3001/users/2', {
      body: users[2]
    }).as('Simon')

    cy.intercept('GET', 'http://localhost:3001/users/3', {
      body: users[3]
    }).as('Clarisse')

    cy.intercept('GET', 'http://localhost:3001/users/4', {
      body: users[4]
    }).as('Clarisse')

    Cypress.on('uncaught:exception', () => false)
    mount(
      <QueryClientProvider client={queryClient}>
        <UserContext.Provider value={users[initialIndex]}>
          <Suspense fallback={<PageSpinner />}>
            <UsersPage />
          </Suspense>
        </UserContext.Provider>
      </QueryClientProvider>
    )
  })

  it('start from scratch', () => {})

  it('renders UsersPage with the context of the user', () => {
    cy.getByCy('users-list').should('be.visible')
    cy.getByCy('user-details')
      .should('be.visible')
      .contains(users[initialIndex + 1].notes)
  })

  it('selecting a user should show its details', () => {
    cy.getByCyLike('list-item')
      .eq(initialIndex + 1)
      .click()
    cy.getByCy('user-details').contains(users[initialIndex + 2].notes)
  })

  it('selecting next user should  show its details', () => {
    cy.getByCy('next-btn').click()
    cy.getByCy('user-details').contains(users[initialIndex + 2].notes)
  })

  // @Feature-flag candidate
  // it.only('selecting previous user should  show its details', () => {
  //   cy.getByCy('prev-btn').click()
  //   cy.getByCy('user-details').contains(users[initialIndex].notes)
  // })

  context('User selection', () => {
    it('should highlight the selected user', () => {
      cy.getByCyLike('list-item')
        .eq(initialIndex + 1)
        .click()
      cy.checkBtnColor(initialIndex, 'rgb(255, 255, 255)')
      cy.checkBtnColor(initialIndex + 1, 'rgb(23, 63, 95)')
    })

    // // @Feature-flag candidate
    // it('should switch to the next user and keep cycling with next button', () => {
    //   cy.getByCy('next-btn').click()
    //   cy.checkBtnColor(initialIndex + 1, 'rgb(23, 63, 95)')
    //   cy.checkBtnColor(initialIndex, 'rgb(255, 255, 255)')

    //   cy.getByCy('next-btn').click().click().click()
    //   cy.checkBtnColor(initialIndex, 'rgb(23, 63, 95)')
    // })

    // // @Feature-flag candidate
    // it('should switch to the previous user and keep cycling with next button', () => {
    //   cy.getByCy('prev-btn').click()
    //   cy.checkBtnColor(initialIndex - 1, 'rgb(23, 63, 95)')
    //   cy.checkBtnColor(initialIndex + 1, 'rgb(255, 255, 255)')

    //   cy.getByCy('prev-btn').click().click().click()
    //   cy.checkBtnColor(initialIndex, 'rgb(23, 63, 95)')
    // })
  })
})

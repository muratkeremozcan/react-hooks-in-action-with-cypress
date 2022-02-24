import { mount } from '@cypress/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import UsersPage from './UsersPage'
import UserContext from './UserContext'
import '../../App.css'
const users = require('../../../cypress/fixtures/users.json')

describe('UserDetails', { viewportWidth: 700, viewportHeight: 700 }, () => {
  const queryClient = new QueryClient()

  const initialIndex = 1
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3001/users', {
      fixture: 'users'
    }).as('userStub')

    mount(
      <QueryClientProvider client={queryClient}>
        <UserContext.Provider value={users[initialIndex]}>
          <UsersPage />
        </UserContext.Provider>
      </QueryClientProvider>
    )
    cy.wait('@userStub')
  })

  it('renders UsersPage with the context of the user', () => {
    cy.getByCy('users-list').should('be.visible')
    cy.getByCy('user-details')
      .should('be.visible')
      .contains(users[initialIndex].notes)
  })

  it('selecting a user should show its details', () => {
    cy.getByCyLike('list-item')
      .eq(initialIndex + 1)
      .click()
    cy.getByCy('user-details').contains(users[initialIndex + 1].notes)
  })

  // @Feature-flag candidate
  it('selecting next user should  show its details', () => {
    cy.getByCy('next-btn').click()
    cy.getByCy('user-details').contains(users[initialIndex + 1].notes)
  })

  // @Feature-flag candidate
  it('selecting previous user should  show its details', () => {
    cy.getByCy('prev-btn').click()
    cy.getByCy('user-details').contains(users[initialIndex - 1].notes)
  })

  context('User selection', () => {
    const checkBtnColor = (i, color) =>
      cy.get('.btn').eq(i).should('have.css', 'background-color', color)

    it('should highlight the selected user', () => {
      cy.getByCyLike('list-item')
        .eq(initialIndex + 1)
        .click()
      checkBtnColor(initialIndex, 'rgb(255, 255, 255)')
      checkBtnColor(initialIndex + 1, 'rgb(23, 63, 95)')
    })

    // @Feature-flag candidate
    it('should switch to the next user and keep cycling with next button', () => {
      cy.getByCy('next-btn').click()
      checkBtnColor(initialIndex + 1, 'rgb(23, 63, 95)')
      checkBtnColor(initialIndex, 'rgb(255, 255, 255)')

      cy.getByCy('next-btn').click().click().click()
      checkBtnColor(initialIndex, 'rgb(23, 63, 95)')
    })

    // @Feature-flag candidate
    it('should switch to the previous user and keep cycling with next button', () => {
      cy.getByCy('prev-btn').click()
      checkBtnColor(initialIndex - 1, 'rgb(23, 63, 95)')
      checkBtnColor(initialIndex + 1, 'rgb(255, 255, 255)')

      cy.getByCy('prev-btn').click().click().click()
      checkBtnColor(initialIndex, 'rgb(23, 63, 95)')
    })
  })
})

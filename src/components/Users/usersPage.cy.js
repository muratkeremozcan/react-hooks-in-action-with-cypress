import { mount } from '@cypress/react'
import UsersPage from './UsersPage'
import '../../App.css'

describe('UserDetails', { viewportWidth: 700, viewportHeight: 700 }, () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3001/users', {
      fixture: 'users'
    }).as('userStub')

    mount(<UsersPage />)
    cy.wait('@userStub')
  })

  it('renders UsersPage', () => {
    cy.getByCy('users-list').should('be.visible')
    cy.getByCy('user-details').should('be.visible')
  })

  it('selecting a user should show its details', () => {
    cy.getByCyLike('list-item').eq(2).click()
    cy.getByCy('user-details').contains('Clarisse')
  })

  // @Feature-flag candidate
  it('selecting next user should  show its details', () => {
    cy.getByCy('next-btn').click()
    cy.getByCy('user-details').contains('Simon')
  })

  // @Feature-flag candidate
  it('selecting previous user should  show its details', () => {
    cy.getByCy('prev-btn').click()
    cy.getByCy('user-details').contains('Sanjiv')
  })
})

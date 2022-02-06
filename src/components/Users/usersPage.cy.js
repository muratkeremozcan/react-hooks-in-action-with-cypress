import { mount } from '@cypress/react'
import UsersPage from './UsersPage'
import '../../App.css'

it('renders UsersPage', () => {
  cy.intercept('GET', 'http://localhost:3001/users', {
    fixture: 'users'
  }).as('userStub')
  mount(<UsersPage />)
  cy.getByCy('users-list').should('be.visible')
})

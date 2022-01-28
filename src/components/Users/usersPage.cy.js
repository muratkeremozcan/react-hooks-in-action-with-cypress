import { mount } from '@cypress/react'
import UsersPage from './UsersPage'
import '../../App.css'

it('renders UsersPage', () => {
  mount(<UsersPage />)
  cy.getByCy('users-list').should('be.visible')
})

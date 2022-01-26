import { mount } from '@cypress/react'
import UsersPage from './UsersPage'

it('renders UsersPage', () => {
  mount(<UsersPage />)
  cy.contains('Users!')
})

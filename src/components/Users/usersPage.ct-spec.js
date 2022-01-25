import { mount } from '@cypress/react'
import UsersPage from './UsersPage'

it('UsersPage renders', () => {
  mount(<UsersPage />)
  cy.contains('Users!')
})

import { mount } from '@cypress/react'
import UsersPage from './UsersPage'

it('works', () => {
  mount(<UsersPage />)
  cy.contains('Users!')
})

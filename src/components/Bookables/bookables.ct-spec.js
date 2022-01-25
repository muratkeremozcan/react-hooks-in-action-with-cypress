import { mount } from '@cypress/react'
import BookablesPage from './BookablesPage'

it('BookablesPage renders', () => {
  mount(<BookablesPage />)
  cy.contains('Bookables!')
})

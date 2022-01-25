import { mount } from '@cypress/react'
import BookablesPage from './BookablesPage'

it('works', () => {
  mount(<BookablesPage />)
  cy.contains('Bookables!')
})

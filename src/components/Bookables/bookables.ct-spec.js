import { mount } from '@cypress/react'
import BookablesPage from './BookablesPage'

it('renders BookablesPage', () => {
  mount(<BookablesPage />)
  cy.contains('Bookables!')
})

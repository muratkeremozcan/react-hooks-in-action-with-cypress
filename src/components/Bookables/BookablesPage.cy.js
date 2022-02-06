import { mount } from '@cypress/react'
import BookablesPage from './BookablesPage'
import '../../App.css'

it('renders BookablesList in BookablesPage', () => {
  cy.intercept('GET', 'http://localhost:3001/bookables', {
    fixture: 'bookables'
  }).as('bookablesStub')
  mount(<BookablesPage />)
  cy.wait('@bookablesStub')
})

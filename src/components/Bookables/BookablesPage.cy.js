import { mount } from '@cypress/react'
import BookablesPage from './BookablesPage'
import '../../App.css'

it('renders BookablesList in BookablesPage', () => {
  mount(<BookablesPage />)
  cy.getByCy('bookables-list').should('be.visible')
})

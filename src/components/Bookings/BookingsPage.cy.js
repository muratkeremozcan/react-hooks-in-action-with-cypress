import { mount } from '@cypress/react'
import BookingsPage from './BookingsPage'
import '../../App.css'

it('renders BookingsPage', () => {
  mount(<BookingsPage />)
  cy.getByCy('date-picker').should('be.visible')
})

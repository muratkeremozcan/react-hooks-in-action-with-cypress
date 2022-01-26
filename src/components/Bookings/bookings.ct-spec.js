import { mount } from '@cypress/react'
import BookingsPage from './BookingsPage'

it('renders BookingsPage', () => {
  mount(<BookingsPage />)
  cy.contains('Bookings!')
})

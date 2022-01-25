import { mount } from '@cypress/react'
import BookingsPage from './BookingsPage'

it('BookingsPage renders', () => {
  mount(<BookingsPage />)
  cy.contains('Bookings!')
})

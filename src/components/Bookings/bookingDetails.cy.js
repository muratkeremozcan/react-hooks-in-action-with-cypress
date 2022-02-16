import { mount } from '@cypress/react'
import BookingDetails from './BookingDetails'
import '../../App.css'

describe('BookingDetails', () => {
  beforeEach(() => {
    mount(<BookingDetails />)
  })

  it('renders BookingDetails', () => {
    cy.getByCy('booking-details').should('be.visible')
  })
})

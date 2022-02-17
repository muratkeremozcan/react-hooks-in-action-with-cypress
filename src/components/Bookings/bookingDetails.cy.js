import { mount } from '@cypress/react'
import BookingDetails from './BookingDetails'
import UserContext from '../Users/UserContext'
import '../../App.css'
const bookableData = require('../../../cypress/fixtures/bookables.json')
const bookings = require('../../../cypress/fixtures/bookings.json')
const users = require('../../../cypress/fixtures/users.json')

describe('BookingDetails', () => {
  it('should render booking message UI if there is no booking', () => {
    mount(<BookingDetails bookable={bookableData[0]} />)
    cy.getByCy('booking-details').should('be.visible')
    cy.getByCy('booking-message').should('be.visible')
    cy.getByCy('booking-controls').should('not.exist')
    cy.getByCy('booking-component').should('not.exist')
  })

  it('should render Booking UI if there is a booking', () => {
    mount(<BookingDetails booking={bookings[8]} bookable={bookableData[0]} />)
    cy.getByCy('booking-details').should('be.visible')
    cy.getByCy('booking-message').should('not.exist')
    cy.getByCy('booking-controls').should('not.exist')
    cy.getByCy('booking-component').should('be.visible')
  })

  it('should render controls through the context api if there is a booker', () => {
    mount(
      <UserContext.Provider value={users[0]}>
        <BookingDetails booking={bookings[8]} bookable={bookableData[0]} />
      </UserContext.Provider>
    )
    cy.getByCy('booking-details').should('be.visible')
    cy.getByCy('booking-message').should('not.exist')
    cy.getByCy('booking-controls').should('be.visible')
    cy.getByCy('booking-component').should('be.visible')
  })
})

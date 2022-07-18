import React from 'react'
import BookingDetails from './BookingDetails'
import UserContext from '../Users/UserContext'
import { QueryClient, QueryClientProvider } from 'react-query'
import * as BH from './bookingsHooks'
import { BrowserRouter } from 'react-router-dom'
import '../../App.css'
const bookableData = require('../../../cypress/fixtures/bookables.json')
const bookings = require('../../../cypress/fixtures/bookings.json')
const users = require('../../../cypress/fixtures/users.json')

describe('BookingDetails', { viewportHeight: 800 }, () => {
  // note this is to make tests independent of each other; not share cache
  let queryClient
  beforeEach(() => {
    queryClient = new QueryClient()
    cy.spy(BH, 'useCreateBooking').as('useCreateBooking')
    cy.spy(BH, 'useUpdateBooking').as('useUpdateBooking')
    cy.spy(BH, 'useDeleteBooking').as('useDeleteBooking')
  })

  it('should render booking message UI if there is no booking', () => {
    cy.mount(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <BookingDetails bookable={bookableData[0]} />
        </BrowserRouter>
      </QueryClientProvider>
    )
    cy.getByCy('booking-details').should('be.visible')
    cy.getByCy('booking-message').should('be.visible')
    cy.getByCy('booking-controls').should('not.exist')
    cy.getByCy('booking-component').should('not.exist')
  })

  it('should render Booking UI if there is a booking', () => {
    cy.mount(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <BookingDetails booking={bookings[8]} bookable={bookableData[0]} />
        </BrowserRouter>
      </QueryClientProvider>
    )
    cy.getByCy('booking-details').should('be.visible')
    cy.getByCy('booking-message').should('not.exist')
    cy.getByCy('booking-controls').should('not.exist')
    cy.getByCy('booking-component').should('be.visible')
  })

  it('should render controls through the context api if there is a booker', () => {
    cy.mount(
      <QueryClientProvider client={queryClient}>
        <UserContext.Provider value={users[0]}>
          <BrowserRouter>
            <BookingDetails booking={bookings[8]} bookable={bookableData[0]} />
          </BrowserRouter>
        </UserContext.Provider>
      </QueryClientProvider>
    )
    cy.getByCy('booking-details').should('be.visible')
    cy.getByCy('booking-message').should('not.exist')
    cy.getByCy('booking-controls').should('be.visible')
    cy.getByCy('booking-component').should('be.visible')
  })

  context('Edit booking', () => {
    it('renders BookingDetails on Edit and toggles via BookingForm buttons', () => {
      cy.mount(
        <QueryClientProvider client={queryClient}>
          <UserContext.Provider value={users[0]}>
            <BrowserRouter>
              <BookingDetails
                booking={bookings[8]}
                bookable={bookableData[0]}
              />
            </BrowserRouter>
          </UserContext.Provider>
        </QueryClientProvider>
      )
      cy.get('@useCreateBooking').should('have.been.called')

      cy.log('**Delete toggle**')
      cy.getByCy('booking-controls').click()
      cy.getByCy('booking-form').should('be.visible')
      cy.getByCy('btn-delete').click()
      cy.getByCy('booking-form').should('not.exist')
      cy.contains('Saving')
      cy.get('@useDeleteBooking').should('have.been.called')

      cy.log('**Update toggle**')
      cy.getByCy('booking-controls').click()
      cy.getByCy('booking-form').should('be.visible')
      cy.getByCy('btn-dual').click()
      cy.getByCy('booking-form').should('not.exist')
      cy.get('@useUpdateBooking').should('have.been.called')
    })
  })
})

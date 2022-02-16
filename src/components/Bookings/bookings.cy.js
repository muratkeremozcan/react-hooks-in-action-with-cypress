import Bookings from './Bookings'
import { mount } from '@cypress/react'
import dayjs from 'dayjs'
import '../../App.css'
const bookableData = require('../../../cypress/fixtures/bookables.json')

describe('Bookings', { viewportWidth: 700, viewportHeight: 700 }, () => {
  beforeEach(() => {
    // the fixture data is around valentine's day 2022
    // we cannot control the week prop of the child component
    // so we control the time with cy.clock in order to match the fixture data
    cy.clock(new Date('2022 2 14'))

    cy.intercept('GET', 'http://localhost:3001/bookings?bookableId**', {
      fixture: 'bookings'
    }).as('data')

    mount(<Bookings bookable={bookableData[0]} />)
  })

  it('should render WeekPicker and BookingDetails', () => {
    cy.getByCy('week-picker').contains('The date')
    cy.getByCy('booking-details').should('be.visible')
  })

  it('should render BookingGrid and change the selected cell on click', () => {
    cy.getByCy('bookings-grid').should('have.class', 'active')
    cy.getByCy('Morning-2022-02-14').click()
    cy.getByCy('Morning-2022-02-14').should('have.class', 'selected')

    cy.getByCy('Lunch-2022-02-14').click()
    cy.getByCy('Lunch-2022-02-14').should('have.class', 'selected')
    cy.getByCy('Morning-2022-02-14').should('not.have.class', 'selected')
  })

  context('WeekPicker', () => {
    it('should show the beginning of the week with today', () => {
      cy.getByCy('today').click()
      cy.getByCy('week-interval').should(
        'contain',
        dayjs().startOf('week').$d.toDateString()
      )
    })
    it('should show previous week with prev-week', () => {
      cy.getByCy('prev-week').click()
      cy.getByCy('week-interval').should(
        'contain',
        dayjs().startOf('week').subtract(1, 'week').$d.toDateString()
      )
    })
    it('should show next week with next-week', () => {
      cy.getByCy('next-week').click()
      cy.getByCy('week-interval').should(
        'contain',
        dayjs().startOf('week').add(1, 'week').$d.toDateString()
      )
    })
    it('should show a week and date when go to date feature is used', () => {
      cy.getByCy('date-input').clear().type('2020-09-02')
      cy.getByCyLike('go').click()
      cy.getByCy('week-interval').contains('Sun Aug 30 2020 - Sat Sep 05 2020')
    })
  })
})

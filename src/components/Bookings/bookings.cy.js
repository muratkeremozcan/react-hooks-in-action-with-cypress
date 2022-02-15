import Bookings from './Bookings'
import { mount } from '@cypress/react'
import dayjs from 'dayjs'
import { isoRegex } from '../../utils/regex'
import '../../App.css'

describe('Bookings', { viewportWidth: 700, viewportHeight: 700 }, () => {
  let bookable
  beforeEach(() =>
    cy.fixture('bookables').then((bookableData) => {
      bookable = bookableData
      mount(<Bookings bookable={bookable[0]} />)
    })
  )

  it('should render WeekPicker, BookingsGrid and BookingDetails', () => {
    cy.getByCy('week-picker').contains('The date')
    cy.getByCy('bookings-grid').contains(bookable[0].title).contains(isoRegex)
    cy.getByCy('booking-details')
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

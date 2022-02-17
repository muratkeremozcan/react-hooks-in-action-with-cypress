import { mount } from '@cypress/react'
import Booking from './Booking'
import { dateRegex } from '../../utils/regex'
import '../../App.css'
const bookableData = require('../../../cypress/fixtures/bookables.json')
const bookings = require('../../../cypress/fixtures/bookings.json')

describe('Booking', () => {
  it('should render labels and notes', () => {
    mount(<Booking booking={bookings[8]} bookable={bookableData[0]} />)

    cy.contains(bookings[8].title)
    cy.contains(bookableData[0].title)
    cy.contains(dateRegex)
    cy.contains(bookings[8].session)
    cy.getByCy('notes').should('be.visible')
  })

  it('should not render notes if there are none', () => {
    mount(<Booking booking={bookings[0]} bookable={bookableData[0]} />)

    cy.getByCy('notes').should('not.exist')
  })
})

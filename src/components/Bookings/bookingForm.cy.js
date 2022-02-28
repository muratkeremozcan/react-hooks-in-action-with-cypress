import { mount } from '@cypress/react'
import BookingForm from './BookingForm'
import { usLocaleDateRegex } from '../../utils/regex'
import '../../App.css'
const bookableData = require('../../../cypress/fixtures/bookables.json')
const bookings = require('../../../cypress/fixtures/bookings.json')

describe('BookingForm', { viewportHeight: 700 }, () => {
  it('should not render without a booking', () => {
    mount(<BookingForm bookable={bookableData[0]} />)
    cy.getByCy('booking-form').should('not.exist')
  })

  context('new booking', () => {
    it('should render Add Booking button', () => {
      mount(
        <BookingForm
          booking={[]}
          bookable={bookableData[0]}
          onSave={cy.spy().as('onSave')}
          onDelete={cy.spy().as('onDelete')}
        />
      )

      cy.getByCy('btn-delete').should('not.exist')
      cy.getByCy('btn-dual').contains('Add Booking').click()
      cy.get('@onSave').should('be.called')
    })
  })

  context('existing booking', () => {
    it('should render the fields Delete button and Update button', () => {
      mount(
        <BookingForm
          booking={bookings[8]}
          bookable={bookableData[0]}
          onSave={cy.spy().as('onSave')}
          onDelete={cy.spy().as('onDelete')}
        />
      )

      cy.get('input').should('have.value', bookings[8].title)
      cy.contains(bookableData[0].title)
      cy.contains(usLocaleDateRegex)
      cy.getByCy('notes').contains(bookings[8].notes)

      cy.getByCy('btn-dual').contains('Update').click()
      cy.get('@onSave').should('be.called')

      cy.getByCy('btn-delete').click()
      cy.get('@onDelete').should('be.called')
    })
  })
})

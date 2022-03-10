import BookingsGrid from './BookingsGrid'
import { mount } from '@cypress/react'
import { getWeek } from '../../utils/date-wrangler'
import { QueryClient, QueryClientProvider } from 'react-query'
import '../../App.css'
const bookableData = require('../../../cypress/fixtures/bookables.json')
const bookings = require('../../../cypress/fixtures/bookings.json')

describe('BookingsGrid', { viewportWidth: 800, viewportHeight: 700 }, () => {
  // the fixture data is around valentine's day 2022
  // fix the week prop so that state is consistent
  const week = getWeek(new Date('2022 2 14'))

  let queryClient
  beforeEach(() => (queryClient = new QueryClient()))

  it('should render the error an spinner', () => {
    Cypress.on('uncaught:exception', () => false)
    cy.clock()
    cy.intercept(
      {
        method: 'GET',
        url: 'http://localhost:3001/bookings?bookableId**'
      },
      {
        statusCode: 500
      }
    ).as('statusError')

    mount(
      <QueryClientProvider client={queryClient}>
        <BookingsGrid
          bookable={bookableData[0]}
          week={week}
          booking={bookings[1]}
          setBooking={() => null}
        />
      </QueryClientProvider>
    )

    Cypress._.times(4, () => {
      cy.tick(5000)
      cy.wait('@statusError', { timeout: 10000 })
    })

    cy.getByCy('bookings-grid')
      .should('be.visible')
      .and('not.have.class', 'active')

    cy.getByCy('spinner').should('be.visible')
    cy.getByCy('error').should('be.visible')
    cy.getByCyLike('date-')
      .should('have.length.gt', 1)
      .and('be.visible')
      .first()
      .contains('2022')
    cy.getByCyLike('session-')
      .should('have.length.gt', 1)
      .and('be.visible')
      .and('contain', 'Morning')
  })

  it('should render the grid with bookings', () => {
    cy.intercept(
      {
        method: 'GET',
        url: 'http://localhost:3001/bookings?bookableId**'
      },
      {
        fixture: 'bookings',
        delay: 1000
      }
    ).as('data')

    mount(
      <QueryClientProvider client={queryClient}>
        <BookingsGrid
          bookable={bookableData[0]}
          week={week}
          booking={bookings[1]}
          setBooking={cy.spy().as('setBooking')}
        />
      </QueryClientProvider>
    )
    cy.getByCy('bookings-grid')
      .should('be.visible')
      .and('not.have.class', 'active')
    cy.wait('@data')
    cy.getByCy('bookings-grid').should('have.class', 'active')

    cy.getByCy('Lunch-2022-02-13').should('have.class', 'selected').click()

    // one call on render, another one on click
    cy.get('@setBooking').should('be.called', 'twice')
  })
})

import { mount } from '@cypress/react'
import BookingsPage from './BookingsPage'
import { BrowserRouter } from 'react-router-dom'
import '../../App.css'
const bookableData = require('../../../cypress/fixtures/bookables.json')

describe('BookingsPage', { viewportWidth: 900, viewportHeight: 900 }, () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3001/bookables', {
      fixture: 'bookables'
    }).as('bookablesStub')

    mount(
      <BrowserRouter>
        <BookingsPage bookable={bookableData[0]} bookables={bookableData} />
      </BrowserRouter>
    )
  })

  it('renders BookablesList', () => {
    cy.wait('@bookablesStub')
    cy.getByCy('bookables-list').should('be.visible')
    cy.getByCy('bookings').should('be.visible')
  })

  // todo: use different urls for the 4 cases
  // cover the spinner and error cases
  // (here or elsewhere?)
})

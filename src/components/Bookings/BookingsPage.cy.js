import { mount } from '@cypress/react'
import BookingsPage from './BookingsPage'
import '../../App.css'

describe('BookingsPage', { viewportWidth: 700 }, () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3001/bookables', {
      fixture: 'bookables'
    }).as('bookablesStub')
    mount(<BookingsPage />)
    cy.wait('@bookablesStub')
  })
  it('renders BookablesList', () => {
    cy.getByCy('bookables-list').should('be.visible')
  })
})

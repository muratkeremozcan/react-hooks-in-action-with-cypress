import { mount } from '@cypress/react'
import BookingsPage from './BookingsPage'
import UserContext from '../Users/UserContext'
import '../../App.css'
const users = require('../../../cypress/fixtures/users.json')

describe('BookingsPage', { viewportWidth: 900, viewportHeight: 600 }, () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3001/bookables', {
      fixture: 'bookables'
    }).as('bookablesStub')
    mount(
      <UserContext.Provider value={{ user: users[0] }}>
        <BookingsPage />
      </UserContext.Provider>
    )
    cy.wait('@bookablesStub')
  })
  it('renders BookablesList', () => {
    cy.getByCy('bookables-list').should('be.visible')
    cy.getByCy('bookings').should('be.visible')
  })
})

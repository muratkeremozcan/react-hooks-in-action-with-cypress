import { mount } from '@cypress/react'
import App from './App'
import UserContext from './Users/UserContext'
const users = require('../../cypress/fixtures/users.json')

const testRoute = (route) =>
  cy
    .contains(route, { matchCase: false })
    .click()
    .location('pathname')
    .should('equal', `/${route}`)

describe('App component', { viewportWidth: 900, viewportHeight: 900 }, () => {
  const cmp = <App />

  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3001/users', {
      fixture: 'users'
    }).as('userStub')

    cy.intercept('GET', 'http://localhost:3001/bookables', {
      fixture: 'bookables'
    }).as('bookablesStub')
  })

  it('should verify routes', () => {
    mount(<UserContext.Provider value={users[0]}>{cmp}</UserContext.Provider>)

    cy.get('nav').should('be.visible')

    testRoute('bookings')
    testRoute('bookables')
    testRoute('users')
  })
})

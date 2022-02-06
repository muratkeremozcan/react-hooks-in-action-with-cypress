import { mount } from '@cypress/react'
import App from './App'

const testRoute = (route) =>
  cy
    .contains(route, { matchCase: false })
    .click()
    .location('pathname')
    .should('equal', `/${route}`)

describe('App component', () => {
  it('should verify routes', { viewportWidth: 700 }, () => {
    cy.intercept('GET', 'http://localhost:3001/users', {
      fixture: 'users'
    }).as('userStub')

    mount(<App />)

    cy.get('nav').should('be.visible')

    testRoute('bookings')
    testRoute('bookables')
    testRoute('users')
  })
})

const bookable = require('../fixtures/bookables.json')[2]
const users = require('../fixtures/users.json')

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('getByCy', (selector, ...args) =>
  cy.get(`[data-cy="${selector}"]`, ...args)
)

Cypress.Commands.add('getByCyLike', (selector, ...args) =>
  cy.get(`[data-cy*=${selector}]`, ...args)
)

Cypress.Commands.add('getByName', (name) => cy.get(`[name="${name}"]`))

Cypress.Commands.add('checkBtnColor', (i, color) =>
  cy.get('.btn').eq(i).should('have.css', 'background-color', color)
)

Cypress.Commands.add('stubNetwork', () => {
  cy.intercept('GET', 'http://localhost:3001/users', {
    fixture: 'users'
  }).as('userStub')

  cy.intercept('GET', 'http://localhost:3001/users/1', {
    body: users[0]
  }).as('Mark')

  cy.intercept('GET', 'http://localhost:3001/users/2', {
    body: users[1]
  }).as('Simon')

  cy.intercept('GET', 'http://localhost:3001/users/3', {
    body: users[2]
  }).as('Clarisse')

  cy.intercept('GET', 'http://localhost:3001/users/4', {
    body: users[3]
  }).as('Clarisse')

  cy.intercept('GET', 'http://localhost:3001/bookables', {
    fixture: 'bookables'
  }).as('bookablesStub')

  cy.intercept('GET', 'http://localhost:3001/bookables/*', {
    body: bookable
  }).as('bookableStub')
})

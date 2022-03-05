describe('routes', { tags: ['@routes', '@appJs'] }, () => {
  before(() => {
    cy.stubNetwork()
    cy.visit('/')
  })

  beforeEach(() => cy.stubNetwork())

  it('Bookings', () => {
    cy.contains('Bookings').click()
    cy.url().should('contain', '/bookings')
    cy.get('.bookings-page').should('be.visible')
  })

  it('Bookables', () => {
    cy.contains('Bookables').click()
    cy.url().should('contain', '/bookables')
    cy.get('.bookables-page')
  })

  it('Users', () => {
    cy.contains('Users').click()
    cy.url().should('contain', '/users')
    cy.get('.users-page')
  })
})

context('ErrorBoundary', () => {
  it('should display error when a component fails to load', () => {
    cy.intercept('GET', 'http://localhost:3001/users', {
      fixture: 'users',
      statusCode: 500
    }).as('userStub')

    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    })
    cy.clock()
    cy.visit('/')

    Cypress._.times(4, () => {
      cy.tick(5000)
      cy.wait('@userStub')
    })
    cy.contains('Users').click()
    cy.contains('Something went wrong')
  })
})

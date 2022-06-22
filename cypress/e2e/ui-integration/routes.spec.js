describe('routes', { tags: ['@routes', '@appJs'] }, () => {
  before(() => {
    cy.stubNetwork()
    cy.visit('/')
  })

  beforeEach(cy.stubNetwork)

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

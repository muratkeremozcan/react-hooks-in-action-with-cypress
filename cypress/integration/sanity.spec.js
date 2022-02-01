describe('sanity abcs', { tags: '@smoke' }, () => {
  before(() => {
    cy.visit('/')
    cy.contains('Bookables').click()
    cy.url().should('contain', '/bookables')
    cy.get('.bookables-page')
  })
  it('Should keep showing details between a high index and low index when switching groups', () => {
    cy.getByCy('prev-btn').click()
    cy.get('.bookables-page > > select').select('Kit')
    cy.get('.item').should('be.visible')
  })
})

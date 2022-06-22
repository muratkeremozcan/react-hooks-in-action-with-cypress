describe('direct nav to BookableEdit', { tags: '@smoke' }, () => {
  before(() => {
    cy.stubNetwork()
    cy.visit('/bookables/2/edit')
    cy.contains('h2', 'Edit Bookable')
  })

  beforeEach(cy.stubNetwork)

  it('should render the component upon direct nav between routes', () => {
    cy.visit('/bookables/3/edit')
    cy.contains('h2', 'Edit Bookable')

    cy.visit('/bookables/2/edit')
    cy.contains('h2', 'Edit Bookable')
  })

  it('should default to bookables when direct navigating to a non-existing route', () => {
    cy.visit('/bookables/10')

    cy.getByCy('bookables-list').should('be.visible')
  })
})

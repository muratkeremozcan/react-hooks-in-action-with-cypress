/// <reference types="cypress" />

describe('Bookables prev-next-bookable', () => {
  before(() => {
    cy.intercept('GET', '**/bookables').as('bookables')
    cy.visit('/bookings')
    cy.wait('@bookables')
  })

  it('should toggle prev-next-bookable', () => {
    const featureFlagKey = 'prev-next-bookable'
    const userId = 'aa0ceb'

    cy.task('cypress-ld-control:getFeatureFlag', featureFlagKey)
      .then(console.log)
      .its('variations')
      .should('have.length', 4)
    // .and((variations) => {
    //   expect(variations[0].value).to.eq(true)
    //   expect(variations[1].value).to.eq(false)
    // })

    // cy.task('cypress-ld-control:setFeatureFlagForUser', {
    //   featureFlagKey,
    //   userId,
    //   variationIndex: 1
    // })

    // cy.task('cypress-ld-control:getFeatureFlag', featureFlagKey).then(
    //   console.log
    // )
  })
})

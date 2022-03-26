/// <reference types="cypress" />

describe('Bookings date-and-week', () => {
  before(() => {
    cy.intercept('GET', '**/bookables').as('bookables')
    cy.visit('/bookings')
    cy.wait('@bookables')
  })

  it('should toggle date-and-week', () => {
    const featureFlagKey = 'date-and-week'
    const userId = 'aa0ceb'

    cy.task('cypress-ld-control:getFeatureFlag', featureFlagKey)
      .its('variations')
      .then((variations) => {
        Cypress._.map(variations, (variation, i) =>
          cy.log(`${i}: ${variation.value}`)
        )
      })
      .should('have.length', 2)
      .and((variations) => {
        expect(variations[0].value).to.eq(true)
        expect(variations[1].value).to.eq(false)
      })

    cy.log('**variation 0: True**')
    cy.task('cypress-ld-control:setFeatureFlagForUser', {
      featureFlagKey,
      userId,
      variationIndex: 0
    })

    cy.getByCy('week-interval').should('be.visible')

    cy.log('**variation 1: False**')
    cy.task('cypress-ld-control:setFeatureFlagForUser', {
      featureFlagKey,
      userId,
      variationIndex: 1
    })

    cy.getByCy('week-interval').should('not.exist')

    cy.task('cypress-ld-control:removeUserTarget', {
      featureFlagKey,
      userId
    })
  })
})

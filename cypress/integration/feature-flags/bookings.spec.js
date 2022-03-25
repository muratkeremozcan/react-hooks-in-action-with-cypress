/// <reference types="cypress" />

describe('Feature flags', () => {
  it('should sanity check the plugin setup', () => {
    expect(Cypress.env('launchDarklyApiAvailable')).to.eq(true)
  })

  it('should get all flags', () => {
    const flags = [
      'date-and-week',
      'next-prev',
      'slide-show',
      'prev-next-bookable'
    ]

    cy.task('cypress-ld-control:getFeatureFlags')
      .its('items')
      .should('have.length', 4)
      .each((value, index, items) =>
        cy.wrap(items[index]).its('key').should('eq', flags[index])
      )
  })

  context('Bookings feature flags', () => {
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

    // it('should toggle prev-next-bookable', () => {
    //   const featureFlagKey = 'prev-next-bookable'
    //   const userId = 'aa0ceb'

    //   cy.task('cypress-ld-control:getFeatureFlag', featureFlagKey)
    //     .then(console.log)
    //     .its('variations')
    //     .should('have.length', 4)
    //   // .and((variations) => {
    //   //   expect(variations[0].value).to.eq(true)
    //   //   expect(variations[1].value).to.eq(false)
    //   // })

    //   // cy.task('cypress-ld-control:setFeatureFlagForUser', {
    //   //   featureFlagKey,
    //   //   userId,
    //   //   variationIndex: 1
    //   // })

    //   // cy.task('cypress-ld-control:getFeatureFlag', featureFlagKey).then(
    //   //   console.log
    //   // )
    // })
  })

  // after(() => {
  //   cy.task('cypress-ld-control:removeUserTarget', { featureFlagKey, userId })
  // })
})

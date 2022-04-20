import { FLAGS } from '../../../src/utils/flags'

describe('Feature flags sanity', () => {
  it('should sanity check the plugin setup', () => {
    expect(Cypress.env('launchDarklyApiAvailable')).to.eq(true)
  })

  it('should get all flags', () => {
    cy.task('cypress-ld-control:getFeatureFlags')
      .its('items')
      .should('have.length', 4)
      .each((value, index, item) =>
        cy
          .wrap(item[index])
          .its('key')
          .should('eq', Object.values(FLAGS)[index])
      )
  })
})

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
})

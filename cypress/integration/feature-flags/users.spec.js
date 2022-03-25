it('should toggle prev-next-user', () => {
  cy.intercept('GET', '**/users*').as('getUsers*')
  cy.visit('/users')
  cy.wait('@getUsers*')

  const featureFlagKey = 'next-prev'
  const userId = 'aa0ceb'

  cy.task('cypress-ld-control:getFeatureFlag', featureFlagKey)
    .then(console.log)
    .its('variations')
    .should('have.length', 4)

  // cy.task('cypress-ld-control:setFeatureFlagForUser', {
  //   featureFlagKey,
  //   userId,
  //   variationIndex: 1
  // })

  // cy.task('cypress-ld-control:getFeatureFlag', featureFlagKey).then(
  //   console.log
  // )
})

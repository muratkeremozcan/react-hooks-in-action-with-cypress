/// <reference types="cypress" />

it('should sanity check the plugin setup', () => {
  expect(Cypress.env('launchDarklyApiAvailable')).to.eq(true)
})

const featureFlagKey = 'prev-next-bookable'

it('get flags', () => {
  cy.task('cypress-ld-control:getFeatureFlag', 'prev-next-bookable').then(
    console.log
  )
  cy.task('cypress-ld-control:getFeatureFlags').then(console.log)
  // let's print the variations to the Command Log side panel
  // .its('variations')
  // .then((variations) => {
  //   variations.forEach((v, k) => {
  //     cy.log(`${k}: ${v.name} is ${v.value}`)
  //   })
  // })
  // cy.task('cypress-ld-control:setFeatureFlagForUser', {
  //   featureFlagKey,
  //   userId,
  //   variationIndex: 2
  // })
})

// after(() => {
//   cy.task('cypress-ld-control:removeUserTarget', { featureFlagKey, userId })
// })

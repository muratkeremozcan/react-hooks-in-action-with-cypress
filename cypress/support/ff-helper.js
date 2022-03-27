export const setFlagVariation = (featureFlagKey, userId, variationIndex) =>
  cy.task('cypress-ld-control:setFeatureFlagForUser', {
    featureFlagKey,
    userId,
    variationIndex
  })

export const removeUserTarget = (featureFlagKey, userId) =>
  cy.task('cypress-ld-control:removeUserTarget', {
    featureFlagKey,
    userId
  })

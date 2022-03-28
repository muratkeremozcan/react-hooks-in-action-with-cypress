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

/** Can be used for clearing multiple user targets */
export const removeTarget = (featureFlagKey, targetIndex = 0) =>
  cy.task('cypress-ld-control:removeTarget', {
    featureFlagKey,
    targetIndex
  })

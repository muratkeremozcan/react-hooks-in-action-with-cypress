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

const { _ } = Cypress

/** Generates n alphanumeric characters */
const nChars = (n) => _.times(n, () => _.random(35).toString(36)).join('')

export const randomId = () =>
  `${nChars(8)}-${nChars(4)}-${nChars(4)}-${nChars(4)}-${nChars(12)}`

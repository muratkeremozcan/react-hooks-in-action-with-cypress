/// <reference types="cypress" />

import { setFlagVariation, removeUserTarget } from '../../support/ff-helper'
import { FLAGS } from '../../../src/utils/flags'

describe('Bookings date-and-week', () => {
  const featureFlagKey = FLAGS.DATE_AND_WEEK
  let userId

  before(() => {
    cy.intercept('GET', '**/bookables').as('bookables')
    cy.visit('/bookings')
    cy.wait('@bookables')

    cy.getLocalStorage('ld:$anonUserId').then((id) => (userId = id))
  })

  it('should toggle date-and-week', () => {
    cy.log(`user ID is: ${userId}`)

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
    setFlagVariation(featureFlagKey, userId, 0)
    cy.getByCy('week-interval').should('be.visible')

    cy.log('**variation 1: False**')
    setFlagVariation(featureFlagKey, userId, 1)
    cy.getByCy('week-interval').should('not.exist')
  })

  after(() => removeUserTarget(featureFlagKey, userId))
})

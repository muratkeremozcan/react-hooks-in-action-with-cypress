/// <reference types="cypress" />

import spok from 'cy-spok'
import { map } from 'cypress-should-really'
import { setFlagVariation, removeUserTarget } from '../../support/ff-helper'

describe('Users nex-prev', () => {
  before(() => {
    cy.intercept('GET', '**/users').as('users')
    cy.visit('/users')
    cy.wait('@users').wait('@users')
  })

  const featureFlagKey = 'next-prev'
  const userId = 'aa0ceb'
  const expectedFFs = Cypress._.range(0, 4)

  it('should get prev-next-user flags', () => {
    cy.task('cypress-ld-control:getFeatureFlag', featureFlagKey)
      .its('variations')
      .should('have.length', expectedFFs.length)
      .then(map('value'))
      .should(spok(expectedFFs))
  })

  context('flag variations', () => {
    const flagVariation = (variation) =>
      setFlagVariation(featureFlagKey, userId, variation)

    it('should toggle the flag to off off', () => {
      flagVariation(0)

      cy.getByCy('prev-btn').should('not.exist')
      cy.getByCy('next-btn').should('not.exist')
    })

    it('should toggle the flag to off on', () => {
      flagVariation(1)

      cy.getByCy('prev-btn').should('not.exist')
      cy.getByCy('next-btn').should('be.visible')
    })

    it('should toggle the flag to on off', () => {
      flagVariation(2)

      cy.getByCy('prev-btn').should('be.visible')
      cy.getByCy('next-btn').should('not.exist')
    })

    it('should toggle the flag to on on', () => {
      flagVariation(3)

      cy.getByCy('prev-btn').should('be.visible')
      cy.getByCy('next-btn').should('be.visible')
    })

    after(() => removeUserTarget(featureFlagKey, userId))
  })
})

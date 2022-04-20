/// <reference types="cypress" />

import spok from 'cy-spok'
import { map } from 'cypress-should-really'
import { setFlagVariation, removeUserTarget } from '../../support/ff-helper'
import { FLAGS } from '../../../src/utils/flags'

describe('Users prev-next-user', () => {
  const expectedFFs = Cypress._.range(0, 4)
  // the variable will be available throughout the spec
  let userId

  before(() => {
    cy.intercept('GET', '**/users').as('users')
    cy.visit('/users')
    cy.wait('@users').wait('@users')

    // assign the variable in the beginning
    cy.getLocalStorage('ld:$anonUserId').then((id) => (userId = id))
  })

  // preserve the local storage between tests
  beforeEach(() => cy.restoreLocalStorage([userId]))
  afterEach(() => cy.saveLocalStorage([userId]))

  it('should get prev-next-user flags', () => {
    cy.task('cypress-ld-control:getFeatureFlag', FLAGS.PREV_NEXT_USER)
      .its('variations')
      .should('have.length', expectedFFs.length)
      .then(map('value'))
      .should(spok(expectedFFs))
  })

  context('flag variations', () => {
    const flagVariation = (variation) =>
      setFlagVariation(FLAGS.PREV_NEXT_USER, userId, variation)

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

    after(() => removeUserTarget(FLAGS.PREV_NEXT_USER, userId))

    // we could also use removeTarget()
    // which is like a deleteAll in case we have multiple users being targeted
    // mind that it will impact other tests that are concurrently running
    // after(() => removeTarget(FLAGS.PREV_NEXT_USER))
  })
})

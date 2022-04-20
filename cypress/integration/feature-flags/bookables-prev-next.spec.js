/// <reference types="cypress" />
import spok from 'cy-spok'
import { map } from 'cypress-should-really'
import { setFlagVariation, removeUserTarget } from '../../support/ff-helper'
import { FLAGS } from '../../../src/utils/flags'

describe('Bookables prev-next', () => {
  const featureFlagKey = FLAGS.PREV_NEXT
  const expectedFFs = [
    {
      Next: false,
      Previous: false
    },
    {
      Next: true,
      Previous: false
    },
    {
      Next: false,
      Previous: true
    },
    {
      Next: true,
      Previous: true
    }
  ]
  let userId

  before(() => {
    cy.intercept('GET', '**/bookables').as('bookables')
    cy.visit('/bookables')
    cy.wait('@bookables').wait('@bookables')
    cy.getLocalStorage('ld:$anonUserId').then((id) => (userId = id))
  })

  // restore & save localStorage commands restore & take a snapshot
  // we can name that snapshot anything
  // therefore we can use the unique userId for it without issues
  beforeEach(() => cy.restoreLocalStorage([userId]))
  afterEach(() => cy.saveLocalStorage([userId]))

  context('flag sanity', () => {
    it('should get prev-next flags v1', () => {
      cy.task('cypress-ld-control:getFeatureFlag', featureFlagKey)
        .its('variations')
        .should('have.length', expectedFFs.length)
        .and((variations) => {
          const values = Cypress._.map(
            variations,
            (variation) => variation.value
          )
          expect(values).to.deep.eq(expectedFFs)
        })
    })

    it('should get prev-next flags v2', () => {
      cy.task('cypress-ld-control:getFeatureFlag', featureFlagKey)
        .its('variations')
        .should('have.length', expectedFFs.length)
        .then((variations) =>
          Cypress._.map(variations, (variation) => variation.value)
        )
        // with TDD syntax, using should instead of then will ensure retry ability
        // .should((values) => expect(values).to.deep.eq(expectedFFs))
        // alternatively we can use the BDD syntax, same retry ability
        // .then((values) => cy.wrap(values).should('deep.eq', expectedFFs))
        // much concise versions
        // .should('deep.eq', expectedFFs)
        .should(spok(expectedFFs))
    })

    it('should get prev-next flags v3 (favorite)', () => {
      cy.task('cypress-ld-control:getFeatureFlag', featureFlagKey)
        .its('variations')
        .should('have.length', expectedFFs.length)
        .then(map('value'))
        .should(spok(expectedFFs))
    })
  })

  context('flag variations', () => {
    it('should toggle the flag to off off', () => {
      setFlagVariation(featureFlagKey, userId, 0)

      cy.getByCy('prev-btn').should('not.exist')
      cy.getByCy('next-btn').should('not.exist')
    })

    it('should toggle the flag to off on', () => {
      setFlagVariation(featureFlagKey, userId, 1)

      cy.getByCy('prev-btn').should('not.exist')
      cy.getByCy('next-btn').should('be.visible')
    })

    it('should toggle the flag to on off', () => {
      setFlagVariation(featureFlagKey, userId, 2)

      cy.getByCy('prev-btn').should('be.visible')
      cy.getByCy('next-btn').should('not.exist')
    })

    it('should toggle the flag to on on', () => {
      setFlagVariation(featureFlagKey, userId, 3)

      cy.getByCy('prev-btn').should('be.visible')
      cy.getByCy('next-btn').should('be.visible')
    })
  })

  after(() => removeUserTarget(featureFlagKey, userId))
})

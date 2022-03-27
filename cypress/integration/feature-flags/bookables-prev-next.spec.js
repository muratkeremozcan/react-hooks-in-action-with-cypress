/// <reference types="cypress" />
import spok from 'cy-spok'
import { map } from 'cypress-should-really'

describe('Bookables prev-next-bookable', () => {
  before(() => {
    cy.intercept('GET', '**/bookables').as('bookables')
    cy.visit('/bookables')
    cy.wait('@bookables').wait('@bookables')
  })

  const featureFlagKey = 'prev-next-bookable'
  const userId = 'aa0ceb'
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

  context('flag sanity', () => {
    it('should get prev-next-bookable flags v1', () => {
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

    it('should get prev-next-bookable flags v2', () => {
      cy.task('cypress-ld-control:getFeatureFlag', featureFlagKey)
        .its('variations')
        .should('have.length', expectedFFs.length)
        .then((variations) =>
          Cypress._.map(variations, (variation) => variation.value)
        )
        // with TDD syntax, using should instead of then will ensure retry ability
        .should((values) => expect(values).to.deep.eq(expectedFFs))
        // alternatively we can use the BDD syntax, same retry ability
        .then((values) => cy.wrap(values).should('deep.eq', expectedFFs))
        // much concise version using cy-spok
        .should(spok(expectedFFs))
    })

    it('should get prev-next-bookable flags v3 (favorite)', () => {
      cy.task('cypress-ld-control:getFeatureFlag', featureFlagKey)
        .its('variations')
        .should('have.length', expectedFFs.length)
        .then(map('value'))
        .should(spok(expectedFFs))
    })
  })

  context('flag variations', () => {
    const flagVariation = (variationIndex) =>
      cy.task('cypress-ld-control:setFeatureFlagForUser', {
        featureFlagKey,
        userId,
        variationIndex
      })

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

    after(() =>
      cy.task('cypress-ld-control:removeUserTarget', {
        featureFlagKey,
        userId
      })
    )
  })
})

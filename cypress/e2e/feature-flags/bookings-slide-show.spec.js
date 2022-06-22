/// <reference types="cypress" />
import { setFlagVariation, removeUserTarget } from '../../support/ff-helper'
import { FLAGS } from '../../../src/utils/flags'

describe('Bookings slide-show', () => {
  const featureFlagKey = FLAGS.SLIDE_SHOW

  const testBtnColor = (i) =>
    cy
      .getByCy('bookables-list')
      .within(() => cy.checkBtnColor(i, 'rgb(23, 63, 95)'))

  it('should get slide-show flags', () => {
    cy.task('cypress-ld-control:getFeatureFlag', featureFlagKey)
      .its('variations')
      .should('have.length', 2)
      .and((variations) => {
        expect(variations[0].value).to.eq(true)
        expect(variations[1].value).to.eq(false)
      })
  })

  context('Flag on off', () => {
    const initialIndex = 0
    let userId

    beforeEach(() => {
      // nothing to store the first time,
      // we need it for subsequent tests
      cy.restoreLocalStorage([userId])

      // setting up state for the test
      cy.clock()
      cy.stubNetwork()
      cy.visit('/bookables')
      cy.tick(1000)
      cy.wait('@userStub').wait('@bookablesStub')

      // assign the variable and use it throughout the spec
      cy.getLocalStorage('ld:$anonUserId').then((id) => (userId = id))
    })

    afterEach(() => cy.saveLocalStorage([userId]))

    it('should slide show through and stop the presentation', () => {
      setFlagVariation(featureFlagKey, userId, 0)

      for (let i = initialIndex; i < 4; i++) {
        testBtnColor(i)
        cy.tick(3000)
      }
      testBtnColor(initialIndex)

      cy.getByCy('stop-btn').click()
      cy.tick(3000).tick(3000)
      testBtnColor(0)
    })

    it('should not show stop button or rotate bookables on a timer', () => {
      setFlagVariation(featureFlagKey, userId, 1)

      cy.getByCy('stop-btn').should('not.exist')
      cy.tick(3000).tick(3000)
      testBtnColor(initialIndex)
    })

    after(() => removeUserTarget(featureFlagKey, userId))
  })
})

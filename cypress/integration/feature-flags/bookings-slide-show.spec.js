/// <reference types="cypress" />

describe('Bookings slide-show', () => {
  const featureFlagKey = 'slide-show'
  const userId = 'aa0ceb'

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
    const setupState = () => {
      cy.clock()
      cy.stubNetwork()
      cy.visit('/bookables')
      cy.tick(1000)
      return cy.wait('@userStub').wait('@bookablesStub')
    }
    const initialIndex = 0

    it('should slide show through and stop the presentation', () => {
      cy.log('**variation 0: True**')
      cy.task('cypress-ld-control:setFeatureFlagForUser', {
        featureFlagKey,
        userId,
        variationIndex: 0
      })
      setupState()

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
      cy.log('**variation 1: False**')
      cy.task('cypress-ld-control:setFeatureFlagForUser', {
        featureFlagKey,
        userId,
        variationIndex: 1
      })
      setupState()

      cy.getByCy('stop-btn').should('not.exist')
      cy.tick(3000).tick(3000)
      testBtnColor(initialIndex)
    })

    afterEach(() =>
      cy.task('cypress-ld-control:removeUserTarget', {
        featureFlagKey,
        userId
      })
    )
  })
})

import { mount } from '@cypress/react'
import Challenge from './4.challenge'

describe('Challenge', { retries: 1 }, () => {
  let resizeEventFired

  before(() => {
    mount(<Challenge />)
    resizeEventFired = false

    cy.window().then((win) =>
      win.addEventListener('resize', () => (resizeEventFired = true))
    )
  })

  it('should be small under 400 width', () => {
    cy.viewport(399, 500)

    cy.wrap().should(() => expect(resizeEventFired).to.eq(true))
    cy.document().its('title').should('eq', 'small')
    cy.contains('small').contains('300')
  })
})

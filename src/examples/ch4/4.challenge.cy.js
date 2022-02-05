import { mount } from '@cypress/react'
import Challenge from './4.challenge'

describe('Challenge', () => {
  it('should be medium by default', () => {
    mount(<Challenge />)
    cy.document().its('title').should('eq', 'medium')
  })

  it('should be small under 400 width', () => {
    cy.viewport(399, 500)
    mount(<Challenge />)
    cy.document().its('title').should('eq', 'small')
  })

  it('should be large over 800 width', () => {
    cy.viewport(800, 500)
    mount(<Challenge />)
    cy.document().its('title').should('eq', 'large')
  })
})

import ErrorComp from './ErrorComp'
import { mount } from '@cypress/react'

describe('ErrorComp', () => {
  it('should render error', () => {
    mount(<ErrorComp />)
    cy.getByCy('error').should('be.visible')
  })
})

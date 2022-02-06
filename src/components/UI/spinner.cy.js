import Spinner from './Spinner'
import { mount } from '@cypress/react'

describe('Spinner', () => {
  it('should render a spinner', () => {
    mount(<Spinner />)
    cy.getByCy('spinner').should('be.visible')
  })
})

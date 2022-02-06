import PageSpinner from './PageSpinner'
import { mount } from '@cypress/react'

describe('PageSpinner', () => {
  it('should render the page spinner', () => {
    mount(<PageSpinner />)
    cy.getByCyLike('page-spinner').should('be.visible')
  })
})

import Colors from './Colors'
import { mount } from '@cypress/react'
import './styles.css'

// [6.0] when components use the same data to build their UI,
// share that data by passing it as a prop from parent to children

describe('Colors', () => {
  it('should render children', () => {
    mount(<Colors />)
    cy.getByCyLike('teal').click()

    cy.contains('color is teal')
    cy.getByCyLike('sample').should(
      'have.css',
      'background-color',
      'rgb(0, 128, 128)'
    )
  })
})

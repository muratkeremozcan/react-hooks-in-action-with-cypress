import { mount } from '@cypress/react'
import SayHello from './1.1.say-hello-custom-hook'

// issue with react 18 RC
it.skip('useEffect should change document.title', () => {
  mount(<SayHello />)
  cy.spy(Math, 'floor').as('updateGreeting')

  Cypress._.times(2, () => {
    cy.get('button').click()

    cy.get('@updateGreeting').should('be.called')
    cy.document()
      .its('title')
      .should('be.oneOf', ['Hello', 'Ciao', 'Hola', 'こんにちは'])
  })
})

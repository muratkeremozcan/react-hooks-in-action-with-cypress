import React from 'react'
import { mount } from '@cypress/react'
import UserPicker from './UserPicker'

describe('UserPicker component', { tags: '@user' }, () => {
  it('renders UserPicker', () => {
    cy.intercept('GET', 'http://localhost:3001/users', { fixture: 'users' }).as(
      'userStub'
    )
    mount(<UserPicker />)
    cy.wait('@userStub')
    cy.get('select').select(2).should('have.value', 'Clarisse')
  })

  it('should render the spinner while the data is loading', () => {
    cy.intercept(
      {
        method: 'GET',
        url: 'http://localhost:3001/users'
      },
      {
        fixture: 'users',
        delay: 10
      }
    ).as('userStubDelayed')

    mount(<UserPicker />)
    cy.getByCy('spinner').should('be.visible')
    cy.wait('@userStubDelayed')
    cy.getByCy('spinner').should('not.exist')
  })
})

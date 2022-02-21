import React from 'react'
import { mount } from '@cypress/react'
import UserPicker from './UserPicker'
import '../../App.css'
const userData = require('../../../cypress/fixtures/users.json')

describe('UserPicker component', { tags: '@user' }, () => {
  it('should initially call setUser with the the first user, and should select with respective', () => {
    cy.intercept('GET', 'http://localhost:3001/users', {
      fixture: 'users'
    }).as('userStub')
    mount(<UserPicker user={userData[3]} setUser={cy.spy().as('setUser')} />)
    cy.wait('@userStub')

    cy.get('@setUser').should('be.calledWith', userData[0])

    cy.get('select').select(2)
    cy.get('@setUser').should('be.calledWith', userData[2])
  })

  it('should render the spinner while the data is loading', () => {
    cy.intercept(
      {
        method: 'GET',
        url: 'http://localhost:3001/users'
      },
      {
        fixture: 'users',
        delay: 100
      }
    ).as('userStubDelayed')

    mount(<UserPicker setUser={cy.spy().as('setUser')} />)
    cy.getByCy('spinner').should('be.visible')
    cy.wait('@userStubDelayed')
    cy.getByCy('spinner').should('not.exist')
  })

  it('should render error', () => {
    cy.intercept(
      {
        method: 'GET',
        url: 'http://localhost:3001/users'
      },
      {
        statusCode: 500
      }
    ).as('userStubDelayed')

    mount(<UserPicker user={userData[3]} setUser={cy.spy().as('setUser')} />)
    cy.getByCy('error').should('be.visible')
  })
})

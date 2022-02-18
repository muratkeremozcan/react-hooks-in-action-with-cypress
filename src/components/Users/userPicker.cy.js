import React from 'react'
import { mount } from '@cypress/react'
import UserPicker from './UserPicker'
import UserContext from '../Users/UserContext'
import '../../App.css'
const users = require('../../../cypress/fixtures/users.json')

describe('UserPicker component', { tags: '@user' }, () => {
  it('should initially call setUser with the the first user, and should select with respective', () => {
    cy.intercept('GET', 'http://localhost:3001/users', {
      fixture: 'users'
    }).as('userStub')
    mount(
      <UserContext.Provider
        value={{ user: users[0], setUser: cy.spy().as('setUser') }}
      >
        <UserPicker />
      </UserContext.Provider>
    )
    cy.wait('@userStub')

    cy.get('@setUser').should('be.calledWith', users[0])

    cy.get('select').select(2)
    cy.get('@setUser').should('be.calledWith', users[2])
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

    mount(
      <UserContext.Provider
        value={{ user: users[0], setUser: cy.spy().as('setUser') }}
      >
        <UserPicker />
      </UserContext.Provider>
    )
    cy.getByCy('spinner').should('be.visible')
    cy.wait('@userStubDelayed')
    cy.getByCy('spinner').should('not.exist')
  })
})

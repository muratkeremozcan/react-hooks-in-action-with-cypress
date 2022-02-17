import { mount } from '@cypress/react'
import UsersList from './UsersList'
import '../../App.css'
const users = require('../../../cypress/fixtures/users.json')

const checkBtnColor = (i, color) =>
  cy.get('.btn').eq(i).should('have.css', 'background-color', color)

describe('UsersList', { viewportWidth: 700, viewportHeight: 700 }, () => {
  it('should render spinner preload, and set a user as default', () => {
    cy.intercept(
      {
        method: 'GET',
        url: 'http://localhost:3001/users'
      },
      {
        delay: 100,
        fixture: 'users'
      }
    ).as('userStubDelayed')

    mount(<UsersList user={users[1]} setUser={cy.spy().as('setUser')} />)

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
      { statusCode: 500 }
    ).as('networkError')

    mount(<UsersList user={users[1]} />)

    cy.getByCy('error').should('exist')
  })

  it('should highlight the selected user on initial load', () => {
    cy.intercept('GET', 'http://localhost:3001/users', {
      fixture: 'users'
    }).as('userStub')

    mount(<UsersList user={users[1]} setUser={cy.spy().as('setUser')} />)
    cy.wait('@userStub')

    checkBtnColor(1, 'rgb(23, 63, 95)')
    checkBtnColor(0, 'rgb(255, 255, 255)')
  })
})

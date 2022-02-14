import { mount } from '@cypress/react'
import UsersList from './UsersList'
import '../../App.css'

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

    mount(<UsersList setUser={cy.spy().as('setUser')} />)

    cy.getByCy('spinner').should('be.visible')
    cy.wait('@userStubDelayed')
    cy.getByCy('spinner').should('not.exist')
    cy.get('@setUser').should('be.called')
  })

  it('should render error', () => {
    cy.intercept(
      {
        method: 'GET',
        url: 'http://localhost:3001/users'
      },
      { statusCode: 500 }
    ).as('networkError')

    mount(<UsersList />)

    cy.getByCy('error').should('exist')
  })

  context('User selection', () => {
    beforeEach(() => {
      cy.intercept('GET', 'http://localhost:3001/users', {
        fixture: 'users'
      }).as('userStub')

      mount(<UsersList setUser={cy.spy().as('setUser')} />)
      cy.wait('@userStub')
    })

    it('should highlight the selected user', () => {
      cy.log('initial load')
      checkBtnColor(0, 'rgb(23, 63, 95)')
      checkBtnColor(1, 'rgb(255, 255, 255)')

      cy.log('select another user')
      cy.getByCyLike('list-item').eq(2).click()
      checkBtnColor(0, 'rgb(255, 255, 255)')
      checkBtnColor(2, 'rgb(23, 63, 95)')
    })

    // @Feature-flag candidate
    it('should switch to the next user and keep cycling with next button', () => {
      cy.getByCy('next-btn').click()
      checkBtnColor(1, 'rgb(23, 63, 95)')
      checkBtnColor(0, 'rgb(255, 255, 255)')

      cy.getByCy('next-btn').click().click().click()
      checkBtnColor(0, 'rgb(23, 63, 95)')
    })

    // @Feature-flag candidate
    it('should switch to the previous user and keep cycling with next button', () => {
      cy.getByCy('prev-btn').click()
      checkBtnColor(3, 'rgb(23, 63, 95)')
      checkBtnColor(0, 'rgb(255, 255, 255)')

      cy.getByCy('prev-btn').click().click().click()
      checkBtnColor(0, 'rgb(23, 63, 95)')
    })
  })
})

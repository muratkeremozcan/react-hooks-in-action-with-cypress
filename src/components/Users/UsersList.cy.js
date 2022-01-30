import { mount } from '@cypress/react'
import UsersList from './UsersList'
import '../../App.css'

const checkBtnColor = (i, color) =>
  cy.get('.btn').eq(i).should('have.css', 'background-color', color)

describe('UsersList', { viewportWidth: 700, viewportHeight: 700 }, () => {
  beforeEach(() => mount(<UsersList />))

  it('should click and highlight the list item', () => {
    cy.get('.btn').eq(1).click()
    checkBtnColor(1, 'rgb(23, 63, 95)')
    checkBtnColor(0, 'rgb(255, 255, 255)')
  })

  it('should switch to the next user and keep cycling with next button', () => {
    cy.getByCy('next-btn').click()
    checkBtnColor(1, 'rgb(23, 63, 95)')
    checkBtnColor(0, 'rgb(255, 255, 255)')

    cy.getByCy('next-btn').click().click().click()
    checkBtnColor(0, 'rgb(23, 63, 95)')
  })

  it('should switch to the previous user and keep cycling with next button', () => {
    cy.getByCy('prev-btn').click()
    checkBtnColor(3, 'rgb(23, 63, 95)')
    checkBtnColor(0, 'rgb(255, 255, 255)')

    cy.getByCy('prev-btn').click().click().click()
    checkBtnColor(0, 'rgb(23, 63, 95)')
  })

  it('should render user details', () => {
    cy.get('.item.user').should('be.visible')
    cy.get('.item-header').should('be.visible')
    cy.get('.user-details').should('be.visible')
  })
})

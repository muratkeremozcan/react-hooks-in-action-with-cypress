import { mount } from '@cypress/react'
import { BrowserRouter } from 'react-router-dom'
import BookablesPage from './BookablesPage'
import '../../App.css'

const checkBtnColor = (i, color) =>
  cy.get('.btn').eq(i).should('have.css', 'background-color', color)

// question: the route does not default to a path, therefore no component

describe('BookablesPage', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3001/bookables', {
      fixture: 'bookables'
    }).as('bookablesStub')

    mount(
      <BrowserRouter>
        <BookablesPage />
      </BrowserRouter>
    )
    cy.wait('@bookablesStub')
  })

  it.only('renders BookablesList in BookablesPage', () => {
    cy.getByCy('bookables-list').should('be.visible')
    cy.getByCy('bookable-details').should('be.visible')
  })

  it('should highlight the selected bookable', () => {
    cy.log('initial load')
    checkBtnColor(0, 'rgb(23, 63, 95)')
    checkBtnColor(1, 'rgb(255, 255, 255)')

    cy.log('select another listing')
    cy.getByCyLike('list-item').eq(2).click()
    checkBtnColor(0, 'rgb(255, 255, 255)')
    checkBtnColor(2, 'rgb(23, 63, 95)')
  })

  it('should switch to the next user and keep cycling with next button', () => {
    cy.getByCy('next-btn').click()
    checkBtnColor(1, 'rgb(23, 63, 95)')
    checkBtnColor(0, 'rgb(255, 255, 255)')

    cy.getByCy('next-btn').click().click().click()
    checkBtnColor(0, 'rgb(23, 63, 95)')
  })

  it('should switch the bookable group', () => {
    cy.get('select').select(1)
    cy.getByCyLike('bookable-list-item').should('have.length', 2)

    cy.get('select').select(0)
    cy.getByCyLike('bookable-list-item').should('have.length', 4)
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

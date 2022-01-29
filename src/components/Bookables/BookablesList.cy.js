import { mount } from '@cypress/react'
import BookablesList from './BookablesList'
import '../../App.css'

const checkBtnColor = (i, color) =>
  cy.get('.btn').eq(i).should('have.css', 'background-color', color)

// the data is static at the component
// in a real world case we would intercept and stub that at the test

describe('BookablesList', () => {
  beforeEach(() => {
    mount(<BookablesList />)
  })

  it('should click and highlight the list item', () => {
    cy.get('.btn').eq(1).click()
    checkBtnColor(1, 'rgb(23, 63, 95)')
    checkBtnColor(0, 'rgb(255, 255, 255)')
  })

  it('should switch to the next bookable and keep cycling with next button', () => {
    cy.getByCy('next-btn').click()
    checkBtnColor(1, 'rgb(23, 63, 95)')
    checkBtnColor(0, 'rgb(255, 255, 255)')

    cy.getByCy('next-btn').click().click().click()
    checkBtnColor(0, 'rgb(23, 63, 95)')
  })

  it('selects the other dropdown list of items', () => {
    cy.get('select').select(1)
    cy.get('.btn').first().contains('Projector')
  })
})

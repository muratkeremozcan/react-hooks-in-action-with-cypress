import { mount } from '@cypress/react'
import BookablesList from './BookablesList'
import '../../App.css'

const checkBtnColor = (i, color) =>
  cy.get('.btn').eq(i).should('have.css', 'background-color', color)

it('renders BookablesList with buttons', () => {
  mount(<BookablesList />)

  checkBtnColor(1, 'rgb(23, 63, 95)')

  cy.get('.btn').eq(2).click()
  checkBtnColor(2, 'rgb(23, 63, 95)')
  checkBtnColor(1, 'rgb(255, 255, 255)')
})

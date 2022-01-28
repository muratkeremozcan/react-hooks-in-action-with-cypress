import { mount } from '@cypress/react'
import UsersList from './UsersList'
import '../../App.css'

const checkBtnColor = (i, color) =>
  cy.get('.btn').eq(i).should('have.css', 'background-color', color)

it('renders', () => {
  mount(<UsersList />)

  cy.get('.btn').eq(2).click()
  checkBtnColor(2, 'rgb(23, 63, 95)')
  checkBtnColor(0, 'rgb(255, 255, 255)')
  checkBtnColor(1, 'rgb(255, 255, 255)')
})

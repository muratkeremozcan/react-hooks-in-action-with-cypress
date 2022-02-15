import BookablesView from './BookablesView'
import { mount } from '@cypress/react'
import '../../App.css'

const checkBtnColor = (i, color) =>
  cy.get('.btn').eq(i).should('have.css', 'background-color', color)

describe('BookablesView', { viewportWidth: 700, viewportHeight: 700 }, () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3001/bookables', {
      fixture: 'bookables'
    }).as('bookablesStub')
    mount(<BookablesView />)
    cy.wait('@bookablesStub')
  })

  it('should render the children: BookablesList and BookableDetails ', () => {
    cy.getByCy('bookables-list').should('be.visible')
    cy.getByCy('bookable-details').should('be.visible')
  })

  // @FeatureFlag candidate (tied to changeBookable in BookablesList)
  // it('should click and highlight the list item and ch[5.4] the focus should be on Next button', () => {
  //   cy.get('.btn').eq(1).click()
  //   checkBtnColor(1, 'rgb(23, 63, 95)')
  //   checkBtnColor(0, 'rgb(255, 255, 255)')
  //   cy.getByCy('next-btn').should('be.focused')
  // })

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

  it('should retain the details between bookables', () => {
    cy.get('.bookable-availability > >').should('have.length.gt', 0)

    cy.getByCy('next-btn').click()
    cy.get('.bookable-availability > >').should('have.length.gt', 0)
  })
})

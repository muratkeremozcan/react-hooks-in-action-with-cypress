import BookablesView from './BookablesView'
import { BrowserRouter } from 'react-router-dom'
import { mount } from '@cypress/react'
import '../../App.css'

describe('BookablesView', { viewportWidth: 700, viewportHeight: 700 }, () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3001/bookables', {
      fixture: 'bookables'
    }).as('bookablesStub')

    mount(
      <BrowserRouter>
        <BookablesView />
      </BrowserRouter>
    )
    cy.wait('@bookablesStub')
  })

  it('should render the children: BookablesList and BookableDetails ', () => {
    cy.getByCy('bookables-list').should('be.visible')
    cy.getByCy('bookable-details').should('be.visible')
  })

  it('should switch to the next bookable and keep cycling with next button', () => {
    cy.getByCy('next-btn').click()
    cy.location('pathname').should('eq', '/bookables/2')
  })

  it('selects the other dropdown list of items', () => {
    cy.get('select').select(1)
    cy.location('pathname').should('eq', '/bookables/5')
  })

  // @FeatureFlag candidate (tied to changeBookable in BookablesList)
  // it('should click and highlight the list item and ch[5.4] the focus should be on Next button', () => {
  //   cy.get('.btn').eq(1).click()
  //   checkBtnColor(1, 'rgb(23, 63, 95)')
  //   checkBtnColor(0, 'rgb(255, 255, 255)')
  //   cy.getByCy('next-btn').should('be.focused')
  // })
})

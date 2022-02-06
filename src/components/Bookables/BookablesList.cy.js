import { mount } from '@cypress/react'
import BookablesList from './BookablesList'
import '../../App.css'

const checkBtnColor = (i, color) =>
  cy.get('.btn').eq(i).should('have.css', 'background-color', color)

// the data is static at the component
// in a real world case we would intercept and stub that at the test

describe('BookablesList', { viewportWidth: 700, viewportHeight: 700 }, () => {
  context('with stubbed data', () => {
    beforeEach(() => {
      cy.intercept('GET', 'http://localhost:3001/bookables', {
        fixture: 'bookables'
      }).as('bookablesStub')
      mount(<BookablesList />)
      cy.wait('@bookablesStub')
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

    it('should switch to the previous bookable and keep cycling with next button', () => {
      cy.getByCy('prev-btn').click()
      checkBtnColor(3, 'rgb(23, 63, 95)')
      checkBtnColor(0, 'rgb(255, 255, 255)')

      cy.getByCy('prev-btn').click().click().click()
      checkBtnColor(0, 'rgb(23, 63, 95)')
    })

    it('selects the other dropdown list of items', () => {
      cy.get('select').select(1)
      cy.get('.btn').first().contains('Projector')
    })

    it('should toggle the details with show details', () => {
      cy.getByCy('show-details').click()
      cy.get('.item-details').should('not.exist')

      cy.getByCy('show-details').click()
      cy.get('.item-details').should('be.visible')
    })

    it('should retain the details between bookables', () => {
      cy.get('.bookable-availability > >').should('have.length.gt', 0)

      cy.getByCy('next-btn').click()
      cy.get('.bookable-availability > >').should('have.length.gt', 0)
    })
  })

  context('with delay', () => {
    it('should render spinner', () => {
      cy.intercept(
        {
          method: 'GET',
          url: 'http://localhost:3001/bookables'
        },
        {
          delay: 100,
          fixture: 'bookables'
        }
      ).as('bookablesStubDelayed')

      mount(<BookablesList />)
      cy.getByCy('spinner').should('be.visible')
      cy.wait('@bookablesStubDelayed')
      cy.getByCy('spinner').should('not.exist')
    })
  })
  context('with error', () => {
    it('should render error', () => {
      cy.intercept(
        {
          method: 'GET',
          url: 'http://localhost:3001/bookables'
        },
        {
          statusCode: 500
        }
      ).as('bookablesStubError')

      mount(<BookablesList />)
      cy.wait('@bookablesStubError')
      cy.getByCy('error').should('be.visible')
    })
  })
})

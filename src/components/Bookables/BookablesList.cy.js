import { mount } from '@cypress/react'
import { BrowserRouter } from 'react-router-dom'
import BookablesList from './BookablesList'
import '../../App.css'
const bookableData = require('../../../cypress/fixtures/bookables.json')

// the data is static at the component
// in a real world case we would intercept and stub that at the test

describe('BookablesList', { viewportWidth: 900, viewportHeight: 700 }, () => {
  context('Populated list', () => {
    const initial = 1
    beforeEach(() => {
      mount(
        <BrowserRouter>
          <BookablesList
            bookable={bookableData[initial]}
            bookables={bookableData}
            getUrl={(id) => `/bookables/${id}`}
          />
        </BrowserRouter>
      )
    })

    it('should have a list item highlighted', () => {
      cy.checkBtnColor(initial, 'rgb(23, 63, 95)')
      cy.checkBtnColor(initial + 1, 'rgb(255, 255, 255)')
    })

    it('should change url on any interaction with the list', () => {
      cy.get('.btn')
        .eq(initial + 1)
        .click()

      cy.location('pathname').should('eq', `/bookables/${initial + 2}`)
    })

    it('should change url on any interaction with the next button', () => {
      cy.getByCy('next-btn').click()
      cy.location('pathname').should('eq', `/bookables/${initial + 2}`)
    })

    it('should change url on dropdown selection', () => {
      cy.get('select').select(1)
      cy.location('pathname').should('eq', `/bookables/${initial + 4}`)
    })
  })

  // @featureFlag (previous bookable)
  context('previous bookable', () => {
    it('should switch to the previous bookable and keep cycling with next button', () => {
      mount(
        <BrowserRouter>
          <BookablesList
            bookable={bookableData[0]}
            bookables={bookableData}
            getUrl={(id) => `/bookables/${id}`}
          />
        </BrowserRouter>
      )
      cy.getByCy('prev-btn').click()
      cy.location('pathname').should('eq', `/bookables/4`)
    })
  })

  // @featureFlag (slide show)
  context('slide show', () => {
    beforeEach(() => {
      cy.clock()

      mount(
        <BrowserRouter>
          <BookablesList
            bookable={bookableData[0]}
            bookables={bookableData}
            getUrl={(id) => `/bookables/${id}`}
          />
        </BrowserRouter>
      )
    })

    it('should stop the presentation', () => {
      cy.getByCy('stop-btn').click()
      cy.tick(3000)
      cy.location('pathname').should('not.eq', `/bookables/2`)
    })

    it('should go through a presentation changing the bookable every 3 seconds', () => {
      cy.tick(3000)
      cy.location('pathname').should('eq', `/bookables/2`)
    })
  })
})

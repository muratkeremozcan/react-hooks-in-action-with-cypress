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
            // ask: we are copying the fn here, what is a good way to stub instead?
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

  // @featureFlag candidate
  // it('should switch to the previous bookable and keep cycling with next button', () => {
  //   cy.getByCy('prev-btn').click()
  //   cy.checkBtnColor(3, 'rgb(23, 63, 95)')
  //   cy.checkBtnColor(0, 'rgb(255, 255, 255)')

  //   cy.getByCy('prev-btn').click().click().click()
  //   cy.checkBtnColor(0, 'rgb(23, 63, 95)')
  // })

  // @featureFlag candidate
  // context('useRef', () => {
  //   it('should go through a presentation changing the bookable every 3 seconds', () => {
  //     cy.clock()

  //     cy.intercept('GET', 'http://localhost:3001/bookables', {
  //       fixture: 'bookables'
  //     }).as('bookablesStub')

  //     mount(<BookablesList />)
  //     cy.wait('@bookablesStub')

  //     for (let i = 0; i <= 3; i++) {
  //       cy.checkBtnColor(i, 'rgb(23, 63, 95)')
  //       cy.tick(3000)
  //     }
  //     cy.checkBtnColor(0, 'rgb(23, 63, 95)')
  //   })
  // })
})

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

    // @FF_prevNextBookable
    it.skip('should change url on any interaction with the next button', () => {
      cy.getByCy('next-btn').click()
      cy.location('pathname').should('eq', `/bookables/${initial + 2}`)
    })

    it('should change url on dropdown selection', () => {
      cy.get('select').select(1)
      cy.location('pathname').should('eq', `/bookables/${initial + 4}`)
    })
  })

  // @FF_prevNextBookable
  // https://github.com/cypress-io/cypress/issues/18662
  // Stubbing modules isn't working in the component runner. The same thing is ok in the e2e runner. Wait for Cy 10
  // TODO: once stubbing works in Cypress 10, try to stub the LaunchDarkly hook
  // https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/stubbing-spying__functions
  /*

  import * as LD from 'launchdarkly-react-client-sdk'

  cy.stub(LD, 'useFlags).returns({ 'pre-next-bookable': {
      "Next": true,
      "Previous": true
    }
  })

  */
  context.skip('previous bookable', () => {
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

  // @FF_slideShow
  // https://github.com/cypress-io/cypress/issues/18662
  // Stubbing modules isn't working in the component runner. The same thing is ok in the e2e runner. Wait for Cy 10
  // TODO: once stubbing works in Cypress 10, try to stub the LaunchDarkly hook
  // https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/stubbing-spying__functions
  /*

  import * as LD from 'launchdarkly-react-client-sdk'

  cy.stub(LD, 'useFlags).returns({ 'slide-show': true })

  */
  context.skip('slide show', () => {
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

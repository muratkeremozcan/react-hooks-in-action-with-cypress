import { FLAGS } from '../../../src/utils/flags'
const bookableData = require('../../fixtures/bookables.json')

describe('Bookables', { viewportHeight: 1000, viewportWidth: 1000 }, () => {
  const allStubs = () => {
    cy.stubNetwork()
    cy.stubFeatureFlags({
      [FLAGS.PREV_NEXT]: { Next: true, Previous: true },
      [FLAGS.SLIDE_SHOW]: true
    })
  }

  before(() => {
    allStubs()

    cy.visit('/bookables')
    cy.url().should('contain', '/bookables')
    cy.get('.bookables-page')
  })

  beforeEach(allStubs)

  const defaultIndex = 0

  it('should display the parent and children', () => {
    cy.getByCy('bookables-view').should('be.visible')
    cy.getByCy('bookables-list').should('be.visible')
    cy.getByCy('bookable-details').should('be.visible')
  })

  it('should highlight the selected bookable', () => {
    cy.getByCy('bookables-list').within(() => {
      cy.checkBtnColor(defaultIndex, 'rgb(23, 63, 95)')
      cy.checkBtnColor(defaultIndex + 1, 'rgb(255, 255, 255)')

      cy.log('select another listing')
      cy.getByCyLike('list-item')
        .eq(defaultIndex + 2)
        .click()
      cy.checkBtnColor(defaultIndex, 'rgb(255, 255, 255)')
      cy.checkBtnColor(defaultIndex + 2, 'rgb(23, 63, 95)')

      cy.log('cycle through to until the first item')
      cy.getByCy('next-btn').click().click()
      cy.checkBtnColor(defaultIndex, 'rgb(23, 63, 95)')
      cy.checkBtnColor(defaultIndex + 1, 'rgb(255, 255, 255)')
    })
  })

  it('should display the matching bookable on details component', () => {
    cy.getByCy('bookable-details').contains(bookableData[defaultIndex].title)

    cy.getByCy('bookables-list').within(() =>
      cy
        .getByCyLike('list-item')
        .eq(defaultIndex + 1)
        .click()
    )

    cy.getByCy('bookable-details').contains(
      bookableData[defaultIndex + 1].title
    )
    cy.getByCy('bookable-details').contains(
      bookableData[defaultIndex + 1].notes
    )
  })

  it('should switch the bookable group', () => {
    cy.getByCy('bookables-list').within(() => {
      cy.get('select').select(1)
      cy.getByCyLike('bookable-list-item').should('have.length', 2)

      cy.get('select').select(0)
      cy.getByCyLike('bookable-list-item').should('have.length', 4)
    })
  })
})

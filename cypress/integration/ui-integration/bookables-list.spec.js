const bookableData = require('../../fixtures/bookables.json')

describe('Bookables', { viewportHeight: 1000, viewportWidth: 1000 }, () => {
  before(() => {
    cy.stubNetwork()
    cy.visit('/bookables')
    cy.url().should('contain', '/bookables')
    cy.get('.bookables-page')
  })

  beforeEach(() => cy.stubNetwork())

  const defaultIndex = 0

  it('should display the parent and children', () => {
    cy.getByCy('bookables-view').should('be.visible')
    cy.getByCy('bookables-list').should('be.visible')
    cy.getByCy('bookable-details').should('be.visible')
  })

  it('should highlight the selected bookable and cycle through the list', () => {
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

  // @featureFlag (previous bookable)
  it('should switch to the previous user and keep cycling with next button', () => {
    cy.getByCy('bookables-list').within(() => {
      cy.checkBtnColor(0, 'rgb(23, 63, 95)')
      cy.getByCy('prev-btn').click()
      cy.checkBtnColor(3, 'rgb(23, 63, 95)')
      cy.checkBtnColor(0, 'rgb(255, 255, 255)')

      cy.getByCy('prev-btn').click().click().click()
      cy.checkBtnColor(0, 'rgb(23, 63, 95)')
    })
  })

  // @featureFlag (slide show)
  context('slide show', () => {
    const testBtnColor = (i) =>
      cy
        .getByCy('bookables-list')
        .within(() => cy.checkBtnColor(i, 'rgb(23, 63, 95)'))

    beforeEach(() => {
      cy.clock()
      cy.visit('/bookables')
      cy.tick(1000)
      cy.wait('@userStub').wait('@bookablesStub')
    })

    it('should cycle through the through a presentation changing the bookable every 3 seconds', () => {
      for (let i = 0; i < 4; i++) {
        testBtnColor(i)
        cy.tick(3000)
      }
      testBtnColor(0)
    })

    it('should stop the presentation', () => {
      cy.getByCy('stop-btn').click()
      cy.tick(3000).tick(3000)
      testBtnColor(0)
    })
  })
})

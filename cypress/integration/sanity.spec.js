/* eslint-disable jest/no-conditional-expect */
/* eslint-disable jest/valid-expect */
import spok from 'cy-spok'

describe('sanity abcs', { tags: '@smoke' }, () => {
  before(() => {
    cy.visit('/')
    cy.contains('Bookables').click()
    cy.url().should('contain', '/bookables')
    cy.get('.bookables-page')
  })
  it('Should keep showing details between a high index and low index when switching groups', () => {
    cy.getByCy('prev-btn').click()
    cy.get('.bookables-page > > select').select('Kit')
    cy.get('.item').should('be.visible')
    cy.getByCy('BookablesList')
      .getComponent()
      .its('state.0')
      .should(
        spok({
          bookableIndex: 0,
          bookables: spok.arrayElements(6) && [
            {
              id: spok.number,
              group: (g) => expect(g).to.be.oneOf(['Kit', 'Rooms']),
              title: spok.string,
              notes: spok.string,
              sessions: spok.arrayElementsRange(3, 5)
            }
          ],
          group: (g) => expect(g).to.be.oneOf(['Kit', 'Rooms']),
          hasDetails: true
        })
      )
  })
})

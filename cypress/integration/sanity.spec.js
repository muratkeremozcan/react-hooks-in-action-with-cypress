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
    cy.getByCy('next-btn').click()
    cy.get('.bookables-page > > select').select('Kit')
    cy.get('.item').should('be.visible')
    cy.getByCy('bookables-list')
      .getComponent()
      .its('state.0')
      .should((s) => expect(s).to.have.length.gt(0))
      .and(
        spok([
          {
            id: spok.number,
            group: (g) => expect(g).to.be.oneOf(['Kit', 'Rooms']),
            title: spok.string,
            notes: spok.string,
            sessions: spok.arrayElementsRange(3, 5)
          }
        ])
      )
  })
})

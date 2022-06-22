// import spok from 'cy-spok'
import { FLAGS } from '../../../src/utils/flags'

describe('Bookable details retainment', { tags: '@smoke' }, () => {
  before(() => {
    cy.stubNetwork()
    cy.stubFeatureFlags({
      [FLAGS.PREV_NEXT]: { Next: true }
    })

    cy.visit('/')
    cy.contains('Bookables').click()
    cy.url().should('contain', '/bookables')
    cy.get('.bookables-page')
  })
  it('Should keep showing details between a high index and low index when switching groups', () => {
    cy.getByCy('next-btn').click()
    cy.getByCy('bookables-list-select').select('Kit')
    cy.get('.item').should('be.visible')

    // this was a cool approach but very brittle during testing
    // it seems that reaching into the component from e2e may hurt TDD
    // cy.getByCy('bookables-list')
    //   .getComponent()
    //   .its('state.0')
    // .should((s) => expect(s).to.have.length.gt(0))
    // .and(
    //   spok([
    //     {
    //       id: spok.number,
    //       group: (g) => expect(g).to.be.oneOf(['Kit', 'Rooms']),
    //       title: spok.string,
    //       notes: spok.string,
    //       sessions: spok.arrayElementsRange(3, 5)
    //     }
    //   ])
    // )
  })
})

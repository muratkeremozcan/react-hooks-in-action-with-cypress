import spok from 'cy-spok'
import { faker } from '@faker-js/faker'

describe(
  'New bookable',
  { tags: '@smoke', viewportHeight: 1000, viewportWidth: 1000 },
  () => {
    before(() => {
      cy.visit('/bookables')
      cy.contains('Bookables').click()
      cy.url().should('contain', '/bookables')
      cy.get('.bookables-page')
    })

    it('should create a new bookable', () => {
      cy.getByCy('new-bookable').click()
      cy.location('pathname').should('contain', '/bookables/new')

      const group = `Group${faker.datatype.number()}`
      const title = `Title${faker.datatype.number()}`
      let notes = faker.lorem.paragraph()

      cy.getByName('group').type(group, { delay: 0 })
      cy.getByName('title').type(title, { delay: 0 })
      cy.getByName('notes').type(notes, { delay: 0 })

      const items = Cypress._.random(0, 5)
      cy.wrap(Cypress._.range(0, items)).each((i) => {
        cy.getByCy(`day-${i}`).click()
        cy.getByCy(`session-${i}`).click()
      })

      cy.intercept('POST', '/bookables').as('saveBookable')
      cy.getByCy('save').click()
      cy.wait('@saveBookable', { timeout: 10000 })
        .its('response')
        .should(
          spok({
            statusCode: 201,
            body: {
              days: spok.arrayElements(items),
              group,
              title,
              notes
            }
          })
        )

      cy.getByCy('bookables-list-select').contains(group)
      cy.getByCyLike('bookable-list-item').contains(title)
      cy.getByCyLike('bookable-details').contains(notes)
      cy.get('.bookable-availability > >').should('have.length', items * 2)

      notes = `edited${notes}`

      cy.log('edit bookable')
      cy.getByCy('edit-bookable').click()
      cy.location('pathname').should('contain', '/edit')
      cy.getByName('notes').clear().type(notes, { delay: 0 })

      cy.intercept('PUT', '/bookables/*').as('editBookable')
      cy.getByCy('save').click()
      cy.wait('@editBookable')
        .its('response')
        .should(
          spok({
            statusCode: 200,
            body: {
              notes
            }
          })
        )

      cy.log('delete bookable')
      cy.getByCy('edit-bookable').click()
      cy.location('pathname').should('contain', '/edit')
      cy.intercept('DELETE', '/bookables/*').as('deleteBookable')
      cy.getByCy('delete').click()
      cy.wait('@deleteBookable').its('response.statusCode').should('eq', 200)
    })
  }
)

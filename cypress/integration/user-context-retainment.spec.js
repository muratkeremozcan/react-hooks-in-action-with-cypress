describe(
  'User selection retainment between routes',
  { tags: '@ui-integration' },
  () => {
    before(() => {
      cy.visit('/')
      cy.intercept('GET', 'http://localhost:3001/users', {
        fixture: 'users'
      }).as('userStub')
    })

    it('Should keep the user context between routes', () => {
      cy.fixture('users').then((users) => {
        cy.get('.user-picker').select(users[3].name)
        cy.contains('Users').click()

        cy.wait('@userStub')
        cy.url().should('contain', '/users')
        cy.get('.item-header').contains(users[3].name)
      })
    })
  }
)

// Applitools version of the visual test
describe(
  'User selection retainment between routes',
  { tags: '@ui-integration' },
  () => {
    beforeEach(ach(() => {
      // Each test should open its own Eyes for its own snapshots
      cy.eyesOpen({
        appName: 'hooks-in-action',
        testName: Cypress.currentTest.title
      })

      cy.stubNetwork()
      cy.visit('/')
    })

    it('Should keep the user context between routes', () => {
      cy.fixture('users').then((users) => {
        cy.get('.user-picker').select(users[3].name)
        cy.contains('Users').click()

        cy.wait('@userStub')
        cy.url().should('contain', '/users')
        cy.get('.item-header').contains(users[3].name)

        // full page test
        cy.eyesCheckWindow({
          tag: 'User selection retainment between routes',
          target: 'window',
          // if fully is true (default) then the snapshot is of the entire page,
          // if fully is false then snapshot is of the viewport.
          fully: false,
          matchLevel: 'Layout'
        })
        // partial page test
        cy.eyesCheckWindow({
          tag: 'user details with custom selector',
          target: 'region',
          selector: '[data-cy="user-details"]'
        })
      })
    })

    afterEach(() => {
      cy.eyesClose()
    })
  }
)

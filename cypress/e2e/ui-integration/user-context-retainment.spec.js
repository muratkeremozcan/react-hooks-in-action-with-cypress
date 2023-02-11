// Percy version of the visual test
describe('User selection retainment between routes', () => {
  beforeEach(() => {
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

      // the visual test
      cy.percySnapshot('User selection retainment between routes')

      // using custom command for css selector focus
      cy.getByCy('user-details').percySnapshotElement(
        'user details with custom selector'
      )
    })
  })
})

function scope(documentClone, selector) {
  const element = documentClone.querySelector(selector)
  documentClone.querySelector('body').innerHTML = element.outerHTML

  return documentClone
}
Cypress.Commands.add(
  'percySnapshotElement',
  { prevSubject: true },
  (subject, name, options) => {
    cy.percySnapshot(name, {
      domTransformation: (documentClone) =>
        scope(documentClone, subject.selector),
      ...options
    })
  }
)

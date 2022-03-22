import { mount } from '@cypress/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Suspense } from 'react'
import UsersPage from './UsersPage'
import PageSpinner from '../UI/PageSpinner'
import UserContext from './UserContext'
import '../../App.css'
const users = require('../../../cypress/fixtures/users.json')

describe('UserDetails', { viewportWidth: 700, viewportHeight: 700 }, () => {
  let queryClient

  const initialIndex = 1

  beforeEach(() => {
    queryClient = new QueryClient()

    cy.stubNetwork()

    Cypress.on('uncaught:exception', () => false)
    mount(
      <QueryClientProvider client={queryClient}>
        <UserContext.Provider value={users[initialIndex]}>
          <Suspense fallback={<PageSpinner />}>
            <UsersPage />
          </Suspense>
        </UserContext.Provider>
      </QueryClientProvider>
    )
  })

  it('renders UsersPage with the context of the user', () => {
    cy.getByCy('users-list').should('be.visible')
    cy.getByCy('user-details')
      .should('be.visible')
      .contains(users[initialIndex].notes)
  })

  it('selecting a user should show its details', () => {
    cy.getByCyLike('list-item')
      .eq(initialIndex + 1)
      .click()
    cy.getByCy('user-details').contains(users[initialIndex + 1].notes)
  })

  // @FF_nextPrev
  // https://github.com/cypress-io/cypress/issues/18662
  // Stubbing modules isn't working in the component runner. The same thing is ok in the e2e runner. Wait for Cy 10
  // TODO: once stubbing works in Cypress 10, try to stub the LaunchDarkly hook
  // https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/stubbing-spying__functions
  /*
  import * as LD from 'launchdarkly-react-client-sdk'

  cy.stub(LD, 'useFlags).returns({ 'prev-next': 3 })
  */
  it.skip('selecting next user should  show its details', () => {
    cy.getByCy('next-btn').click()
    cy.getByCy('user-details').contains(users[initialIndex + 1].notes)
  })

  it('should highlight the selected user', () => {
    cy.getByCyLike('list-item')
      .eq(initialIndex + 1)
      .click()
    cy.checkBtnColor(initialIndex, 'rgb(255, 255, 255)')
    cy.checkBtnColor(initialIndex + 1, 'rgb(23, 63, 95)')
  })

  // @FF_nextPrev
  // https://github.com/cypress-io/cypress/issues/18662
  // Stubbing modules isn't working in the component runner. The same thing is ok in the e2e runner. Wait for Cy 10
  // TODO: once stubbing works in Cypress 10, try to stub the LaunchDarkly hook
  // https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/stubbing-spying__functions
  /*
  import * as LD from 'launchdarkly-react-client-sdk'

  cy.stub(LD, 'useFlags).returns({ 'prev-next': 3 })
  */
  context.skip('feature flag next prev user', () => {
    it('should switch to the next user and keep cycling with next button', () => {
      cy.getByCy('next-btn').click()
      cy.checkBtnColor(initialIndex + 1, 'rgb(23, 63, 95)')
      cy.checkBtnColor(initialIndex, 'rgb(255, 255, 255)')

      cy.getByCy('next-btn').click().click().click()
      cy.checkBtnColor(initialIndex, 'rgb(23, 63, 95)')
    })

    it('should switch to the previous user and keep cycling with next button', () => {
      cy.getByCy('prev-btn').click()
      cy.checkBtnColor(initialIndex - 1, 'rgb(23, 63, 95)')
      cy.checkBtnColor(initialIndex + 1, 'rgb(255, 255, 255)')

      cy.getByCy('prev-btn').click().click().click()
      cy.checkBtnColor(initialIndex, 'rgb(23, 63, 95)')
    })
  })
})

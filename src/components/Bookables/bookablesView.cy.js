import BookablesView from './BookablesView'
import PageSpinner from '../UI/PageSpinner'
import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { mount } from '@cypress/react'
import '../../App.css'

describe('BookablesView', { viewportWidth: 700, viewportHeight: 700 }, () => {
  const queryClient = new QueryClient()

  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3001/bookables', {
      fixture: 'bookables'
    }).as('bookablesStub')

    mount(
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<PageSpinner />}>
          <BrowserRouter>
            <BookablesView />
          </BrowserRouter>
        </Suspense>
      </QueryClientProvider>
    )
  })

  it('should render the children: BookablesList and BookableDetails ', () => {
    cy.getByCy('bookables-list').should('be.visible')
    cy.getByCy('bookable-details').should('be.visible')
  })

  it('should switch to the next bookable and keep cycling with next button', () => {
    cy.getByCy('next-btn').click()
    cy.location('pathname').should('eq', '/bookables/2')
  })

  it('selects the other dropdown list of items', () => {
    Cypress.on('uncaught:exception', () => false)
    cy.get('select').select(1)
    cy.location('pathname').should('eq', '/bookables/5')
  })

  it('should nav to new bookable component on New', () => {
    cy.getByCy('new-bookable').click()
    cy.location('pathname').should('eq', '/bookables/new')
  })

  // @FeatureFlag candidate (tied to changeBookable in BookablesList)
  // it('should click and highlight the list item and ch[5.4] the focus should be on Next button', () => {
  //   cy.get('.btn').eq(1).click()
  //   cy.checkBtnColor(1, 'rgb(23, 63, 95)')
  //   cy.checkBtnColor(0, 'rgb(255, 255, 255)')
  //   cy.getByCy('next-btn').should('be.focused'  // })
})

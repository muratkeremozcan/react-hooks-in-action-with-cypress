import { mount } from '@cypress/react'
import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import BookingsPage from './BookingsPage'
import PageSpinner from '../UI/PageSpinner'
import '../../App.css'
const bookableData = require('../../../cypress/fixtures/bookables.json')

describe('BookingsPage', { viewportWidth: 900, viewportHeight: 900 }, () => {
  const queryClient = new QueryClient()

  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3001/bookables', {
      fixture: 'bookables'
    }).as('bookablesStub')

    mount(
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<PageSpinner />}>
          <BrowserRouter>
            <BookingsPage bookable={bookableData[0]} bookables={bookableData} />
          </BrowserRouter>
        </Suspense>
      </QueryClientProvider>
    )
  })

  it('renders BookablesList', () => {
    cy.wait('@bookablesStub')
    cy.getByCy('bookables-list').should('be.visible')
    cy.getByCy('bookings').should('be.visible')
  })
})

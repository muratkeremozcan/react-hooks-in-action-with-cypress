import { mount } from '@cypress/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import BookableEdit from './BookableEdit'
import '../../App.css'

describe('BookableEdit', { viewportWidth: 1000, viewportHeight: 700 }, () => {
  // note this is to make tests independent of each other; not share cache
  let queryClient
  beforeEach(() => (queryClient = new QueryClient()))

  it('renders', () => {
    // note: the component tries to get state from the url,
    // component test doe snot have a url, and hits bookables/undefined
    // we wildcard the url, so that we get any data
    cy.intercept('GET', 'http://localhost:3001/bookables/*', {
      fixture: 'bookables'
    }).as('bookablesStub')

    mount(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <BookableEdit
            formState={cy.spy().as('formState')}
            handleSubmit={cy.spy().as('handleSubmit')}
            handleDelete={cy.spy().as('handleDelete')}
          />
        </BrowserRouter>
      </QueryClientProvider>
    )

    cy.getByName('title').type('title', { delay: 0 })
    cy.getByName('group').type('group', { delay: 0 })
    cy.getByName('notes').type('notes', { delay: 0 })

    cy.getByCy('day-0').click()
    cy.getByCy('session-0').click()

    // spy on "console.log" calls for now
    cy.window()
      .its('console')
      .then((console) => cy.spy(console, 'log').as('log'))

    cy.getByCy('save').click()
    cy.get('@log').should('be.calledWith', 'handleSubmit')

    cy.getByCy('delete').click()
    cy.get('@log').should('be.calledWith', 'handleDelete')
  })

  it('should show spinner or error', () => {
    cy.intercept(
      {
        method: 'GET',
        url: 'http://localhost:3001/bookables/*'
      },
      {
        delay: 1000,
        statusCode: 500
      }
    ).as('delayError')

    mount(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <BookableEdit
            formState={cy.spy().as('formState')}
            handleSubmit={cy.spy().as('handleSubmit')}
            handleDelete={cy.spy().as('handleDelete')}
          />
        </BrowserRouter>
      </QueryClientProvider>
    )

    cy.getByCy('spinner').should('be.visible')
    Cypress._.times(4, () => cy.wait('@delayError'))
    cy.getByCy('error').should('be.visible')
  })
})

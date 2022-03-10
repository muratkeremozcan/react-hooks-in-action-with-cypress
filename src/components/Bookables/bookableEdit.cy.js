import { mount } from '@cypress/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import BookableEdit from './BookableEdit'
import '../../App.css'

describe('BookableEdit', { viewportWidth: 1000, viewportHeight: 700 }, () => {
  // note this is to make tests independent of each other; not share cache
  let queryClient
  beforeEach(() => (queryClient = new QueryClient()))

  it('should show spinner or error', () => {
    Cypress.on('uncaught:exception', () => false)
    cy.clock()

    cy.intercept(
      {
        method: 'GET',
        url: 'http://localhost:3001/bookables/*'
      },
      {
        delay: 100,
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

    Cypress._.times(4, () => {
      cy.tick(5000)
      cy.wait('@delayError')
    })
    cy.getByCy('error').should('be.visible')
  })

  context('crud', () => {
    beforeEach(() => {
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
              handleSubmit={cy.stub().as('handleSubmit')}
              handleDelete={cy.stub().as('handleDelete')}
            />
          </BrowserRouter>
        </QueryClientProvider>
      )
    })

    it('should edit a component', () => {
      cy.getByName('title').type('title', { delay: 0 })
      cy.getByName('group').type('group', { delay: 0 })
      cy.getByName('notes').type('notes', { delay: 0 })

      cy.getByCy('day-0').click()
      cy.getByCy('session-0').click()

      cy.intercept(
        { method: 'PUT', url: 'http://localhost:3001/bookables/*' },
        { statusCode: 200 }
      ).as('networkStub')

      cy.getByCy('save').click()
      cy.wait('@networkStub')
      // because the nature of the component, and testing it at this level
      // we can take advantage of the error case
      cy.getByCy('error').should('be.visible')
    })

    it('should delete a component', () => {
      cy.intercept(
        { method: 'DELETE', url: 'http://localhost:3001/bookables/*' },
        { statusCode: 200 }
      ).as('networkStub')

      cy.getByCy('delete').click()
      cy.wait('@networkStub')
      // because the nature of the component, and testing it at this level
      // we can take advantage of the error case
      cy.getByCy('error').should('be.visible')
    })
  })
})

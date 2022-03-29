import { mount } from '@cypress/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import BookableNew from './BookableNew'
import '../../App.css'

describe('BookableNew', { viewportWidth: 1000, viewportHeight: 700 }, () => {
  let queryClient

  beforeEach(() => {
    queryClient = new QueryClient()

    mount(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <BookableNew
            formState={cy.spy().as('formState')}
            handleSubmit={cy.spy().as('handleSubmit')}
          />
        </BrowserRouter>
      </QueryClientProvider>
    )

    cy.getByName('title').type('title', { delay: 0 })
    cy.getByName('group').type('group', { delay: 0 })
    cy.getByName('notes').type('notes', { delay: 0 })

    cy.getByCy('day-0').click()
    cy.getByCy('session-0').click()
  })

  it('should nav back to bookables on cancel', () => {
    cy.getByCy('cancel').click()
    cy.location('pathname').should('equal', '/bookables')
  })

  it('should render delay and error', () => {
    cy.intercept('POST', 'http://localhost:3001/bookables', {
      statusCode: 500,
      delay: 100
    }).as('delayError')

    cy.getByCy('save').click()
    cy.getByCy('spinner').should('be.visible')
    cy.wait('@delayError')
    cy.getByCy('error').should('be.visible')
  })

  it('should nav to the new item on post', () => {
    const id = 666

    cy.intercept('POST', 'http://localhost:3001/bookables', {
      statusCode: 200,
      body: {
        id
      }
    }).as('post')

    cy.getByCy('save').click()
    cy.wait('@post')
    cy.location('pathname').should('equal', `/bookables/${id}`)
  })
})

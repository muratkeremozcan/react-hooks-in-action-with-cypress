import { mount } from '@cypress/react'
import { BrowserRouter } from 'react-router-dom'
import BookableNew from './BookableNew'
import '../../App.css'

const getByName = (name) => cy.get(`[name="${name}"]`)

describe('BookableNew', { viewportWidth: 1000, viewportHeight: 700 }, () => {
  it('renders', () => {
    mount(
      <BrowserRouter>
        <BookableNew
          formState={cy.spy().as('formState')}
          handleSubmit={cy.spy().as('handleSubmit')}
        />
      </BrowserRouter>
    )

    getByName('title').type('title', { delay: 0 })
    getByName('group').type('group', { delay: 0 })
    getByName('notes').type('notes', { delay: 0 })

    cy.getByCy('day-0').click()
    cy.getByCy('session-0').click()

    // spy on "console.log" calls for now
    cy.window()
      .its('console')
      .then((console) => cy.spy(console, 'log').as('log'))
    cy.getByCy('save').click()
    cy.get('@log').should('be.calledWith', 'handleSubmit')
  })
})

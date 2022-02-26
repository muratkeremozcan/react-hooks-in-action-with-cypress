import { mount } from '@cypress/react'
import { BrowserRouter } from 'react-router-dom'
import BookableForm from './BookableForm'
import '../../App.css'
const bookableData = require('../../../cypress/fixtures/bookables.json')

const daysOfWeek = [0, 1, 2, 3, 4, 5, 6]
const bookableIndex = 0
const diff = (a, b) => a.filter((v) => !b.includes(v))
// array delta utils
// const unique = (a) => [...new Set(a)]
// const uniqueBy = (x, f) =>
//   Object.values(x.reduce((a, b) => ((a[f(b)] = b), a), {}))
// const intersection = (a, b) => a.filter((v) => b.includes(v))
// const diff = (a, b) => a.filter((v) => !b.includes(v))
// const symDiff = (a, b) => diff(a, b).concat(diff(b, a))
// const union = (a, b) => diff(a, b).concat(b)

// note: need BrowserRouter because Link has to be inside one

describe('BookableForm', { viewportWidth: 1000, viewportHeight: 700 }, () => {
  it('should render New Bookable when there is none existing', () => {
    mount(
      <BrowserRouter>
        <BookableForm
          formState={{}}
          handleSubmit={cy.stub().as('handleSubmit')}
          handleDelete={null}
        />
      </BrowserRouter>
    )

    cy.contains('h2', 'New Bookable')
    cy.getByCyLike('day-').should('not.be.checked')
    cy.getByCyLike('session-').should('not.be.checked')
    cy.getByCy('delete').should('not.exist')
    cy.getByCy('cancel').should('be.visible')

    // why is save allowed on an empty form? Who knows...
    cy.getByCy('save').click()
    cy.get('@handleSubmit').should('be.called')
  })

  it('should render Edit Bookable when there is one existing', () => {
    mount(
      <BrowserRouter>
        <BookableForm
          formState={{}}
          handleSubmit={cy.stub().as('handleSubmit')}
          handleDelete={cy.stub().as('handleDelete')}
        />
      </BrowserRouter>
    )

    cy.contains('h2', 'Edit Bookable')
    cy.getByCy('delete').click()
    cy.get('@handleDelete').should('be.called')
  })

  it('should render Title, Group, Notes, Days, Sessions', () => {
    mount(
      <BrowserRouter>
        <BookableForm
          formState={{ state: bookableData[bookableIndex] }}
          handleSubmit={cy.stub().as('handleSubmit')}
          handleDelete={cy.stub().as('handleDelete')}
        />
      </BrowserRouter>
    )

    cy.getByName('title').should(
      'have.value',
      bookableData[bookableIndex].title
    )
    cy.getByName('group').should(
      'have.value',
      bookableData[bookableIndex].group
    )
    cy.getByName('notes').should(
      'have.value',
      bookableData[bookableIndex].notes
    )

    cy.wrap(bookableData[bookableIndex].days).each((i) =>
      cy.getByCy(`day-${i}`).should('be.checked')
    )
    cy.wrap(diff(bookableData[bookableIndex].days, daysOfWeek)).each((i) =>
      cy.getByCy(`day-${i}`).should('not.be.checked')
    )

    cy.wrap(bookableData[bookableIndex].sessions).each((i) =>
      cy.getByCy(`session-${i}`).should('be.checked')
    )
    cy.wrap(diff(bookableData[bookableIndex].sessions, daysOfWeek)).each((i) =>
      cy.getByCy(`session-${i}`).should('not.be.checked')
    )
  })

  it('should nav to back to the bookable on cancel', () => {
    mount(
      <BrowserRouter>
        <BookableForm
          formState={{ state: bookableData[bookableIndex] }}
          handleSubmit={cy.stub().as('handleSubmit')}
          handleDelete={cy.stub().as('handleDelete')}
        />
      </BrowserRouter>
    )

    cy.getByCy('cancel').click()
    cy.location('pathname').should('equal', `/bookables/${bookableIndex + 1}`)
  })
})

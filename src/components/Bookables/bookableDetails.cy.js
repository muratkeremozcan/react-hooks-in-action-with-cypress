import BookablesDetails from './BookableDetails'
import { BrowserRouter } from 'react-router-dom'
import { mount } from '@cypress/react'
import '../../App.css'

describe('BookableDetails', () => {
  const bookableData = {
    id: 2,
    group: 'Rooms',
    title: 'Lecture Hall',
    notes:
      "For more formal 'sage-on-the-stage' presentations. Seats 100. See Sandra for help with AV setup.",
    sessions: [1, 3, 4],
    days: [0, 1, 2, 3, 4]
  }

  it('should not render without props', () => {
    mount(
      <BrowserRouter>
        <BookablesDetails />)
      </BrowserRouter>
    )

    cy.getByCy('bookables-details').should('not.exist')
  })

  it('should toggle details', () => {
    mount(
      <BrowserRouter>
        <BookablesDetails bookable={bookableData} />)
      </BrowserRouter>
    )
    cy.get('label').contains('Show Details')
    cy.get('input').should('be.checked')
    cy.get('.item-details').should('be.visible')

    cy.get('input').uncheck()
    cy.get('item-details').should('not.exist')
    cy.contains('p', bookableData.notes)
  })

  it('should render with prop data', () => {
    mount(
      <BrowserRouter>
        <BookablesDetails bookable={bookableData} />)
      </BrowserRouter>
    )

    cy.contains('h2', bookableData.title)
    cy.contains('p', bookableData.notes)
    cy.get('.bookable-availability').should('be.visible')
  })
})

import Bookings from './Bookings'
import { mount } from '@cypress/react'
import '../../App.css'

describe('Bookings', { viewportWidth: 900, viewportHeight: 700 }, () => {
  it('should render correctly', () => {
    cy.intercept('GET', 'http://localhost:3001/bookables', {
      fixture: 'bookables'
    }).as('bookablesStub')

    cy.fixture('bookables').then((bookableData) =>
      mount(<Bookings bookable={bookableData[0]} />)
    )

    cy.getByCy('week-picker')
  })
})

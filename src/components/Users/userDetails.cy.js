import { mount } from '@cypress/react'
import UserDetails from './UserDetails'
import '../../App.css'

describe('UserDetails', { viewportWidth: 700, viewportHeight: 700 }, () => {
  it('should display the user', () => {
    cy.fixture('users').then((user) => mount(<UserDetails user={user[0]} />))
    cy.getByCy('user-details').should('be.visible')
  })

  it('should not display anything without a user', () => {
    mount(<UserDetails />)
    cy.getByCy('user-details').should('not.exist')
  })
})

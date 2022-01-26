import React from 'react'
import { mount } from '@cypress/react'
import UserPicker from './UserPicker'

it('renders UserPicker', () => {
  mount(<UserPicker />)
  cy.get('select').select('User2')
})

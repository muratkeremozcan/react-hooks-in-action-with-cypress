import React from 'react'
import { mount } from '@cypress/react'
import UserPicker from './UserPicker'

it('UserPicker  renders', () => {
  mount(<UserPicker />)
  cy.get('select').select('Users2')
})

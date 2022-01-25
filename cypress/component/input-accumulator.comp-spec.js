/// <reference types="cypress" />
import { mount } from '@cypress/react'

const InputAccumulator = () => {
  return <div>yo</div>
}

it('should work', () => {
  mount(<InputAccumulator />)
})

import { mount } from '@cypress/react'
import WeekPicker from './WeekPicker'
import '../../App.css'
import dayjs from 'dayjs'

describe('WeekPicker', () => {
  beforeEach(() => mount(<WeekPicker />))

  it('should show the beginning of the week with today', () => {
    cy.getByCy('today').click()
    cy.getByCy('date').should(
      'contain',
      dayjs().startOf('week').$d.toDateString()
    )
  })

  it('should show previous week with prev-week', () => {
    cy.getByCy('prev-week').click()
    cy.getByCy('date').should(
      'contain',
      dayjs().startOf('week').subtract(1, 'week').$d.toDateString()
    )
  })

  it('should show next week with next-week', () => {
    cy.getByCy('next-week').click()
    cy.getByCy('date').should(
      'contain',
      dayjs().startOf('week').add(1, 'week').$d.toDateString()
    )
  })
})

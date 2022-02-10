import { mount } from '@cypress/react'
import WeekPicker from './WeekPicker'
import '../../App.css'
import dayjs from 'dayjs'

describe('WeekPicker', { viewportWidth: 700 }, () => {
  beforeEach(() => mount(<WeekPicker />))

  it('should show the beginning of the week with today', () => {
    cy.getByCy('today').click()
    cy.getByCy('week-interval').should(
      'contain',
      dayjs().startOf('week').$d.toDateString()
    )
  })

  it('should show previous week with prev-week', () => {
    cy.getByCy('prev-week').click()
    cy.getByCy('week-interval').should(
      'contain',
      dayjs().startOf('week').subtract(1, 'week').$d.toDateString()
    )
  })

  it('should show next week with next-week', () => {
    cy.getByCy('next-week').click()
    cy.getByCy('week-interval').should(
      'contain',
      dayjs().startOf('week').add(1, 'week').$d.toDateString()
    )
  })

  it('should show a week and date when go to date feature is used', () => {
    cy.getByCy('date-input').clear().type('2020-09-02')
    cy.getByCyLike('go').click()
    cy.getByCy('week-interval').contains('Sun Aug 30 2020 - Sat Sep 05 2020')
    cy.getByCy('todays-date').contains('The date is Tue Sep 01 2020')
  })
})

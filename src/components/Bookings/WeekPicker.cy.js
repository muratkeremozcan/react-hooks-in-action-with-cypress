import { mount } from '@cypress/react'
import WeekPicker from './WeekPicker'
import dayjs from 'dayjs'
import { getWeek } from '../../utils/date-wrangler'
import '../../App.css'

describe('WeekPicker', { viewportWidth: 700 }, () => {
  // week is a @FeatureFlag candidate, how do we handle that in a prop?
  const newWeek = getWeek(new Date())
  beforeEach(() =>
    mount(<WeekPicker dispatch={cy.spy().as('dispatch')} week={newWeek} />)
  )

  it('should show the beginning of the week with today', () => {
    cy.getByCy('today').click()
    cy.getByCy('prev-week').click()
    cy.getByCy('next-week').click()
    cy.get('@dispatch').should('be.called', 'thrice')
  })

  it('should show a week and date when go to date feature is used', () => {
    cy.getByCy('date-input').clear().type('2020-09-02')
    cy.getByCyLike('go').click()
    cy.get('@dispatch').should('be.called')
  })

  // @FeatureFlag candidate
  it('should render the week interval and today', () => {
    cy.getByCy('week-interval').should(
      'contain',
      dayjs().startOf('week').$d.toDateString()
    )

    cy.getByCy('todays-date').contains(
      `The date is ${dayjs().$d.toDateString()}`
    )
  })
})

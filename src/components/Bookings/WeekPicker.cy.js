import { mount } from '@cypress/react'
import { BrowserRouter } from 'react-router-dom'
import WeekPicker from './WeekPicker'
import dayjs from 'dayjs'
import { getWeek } from '../../utils/date-wrangler'
import '../../App.css'

describe('WeekPicker', { viewportWidth: 700 }, () => {
  const newWeek = getWeek(new Date())
  beforeEach(() =>
    mount(
      <BrowserRouter>
        <WeekPicker week={newWeek} />
      </BrowserRouter>
    )
  )

  it('should show the beginning of the week with today', () => {
    cy.getByCy('today').click()
    cy.getByCy('prev-week').click()
    cy.getByCy('next-week').click()
  })

  it('should show a week and date when go to date feature is used', () => {
    cy.getByCy('date-input').clear().type('2020-09-02')
    cy.getByCyLike('go').click()
  })

  // @featureFlag (today's date and this week)
  it('should render the week interval and today', () => {
    cy.getByCy('today').click()

    cy.getByCy('week-interval').should(
      'contain',
      dayjs().startOf('week').$d.toDateString()
    )
  })
})

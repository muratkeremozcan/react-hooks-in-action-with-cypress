import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import * as LD from 'launchdarkly-react-client-sdk'
import { FLAGS } from '../../utils/flags'
import WeekPicker from './WeekPicker'
import dayjs from 'dayjs'
import { getWeek } from '../../utils/date-wrangler'

import '../../App.css'

describe('WeekPicker', { viewportWidth: 700 }, () => {
  const newWeek = getWeek(new Date())
  beforeEach(() =>
    cy.mount(
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

  it('should render the week interval and today', () => {
    cy.stub(LD, 'useFlags').returns({ [FLAGS.DATE_AND_WEEK]: true })
    cy.getByCy('today').click()

    cy.getByCy('week-interval').should(
      'contain',
      dayjs().startOf('week').$d.toDateString()
    )
  })
})

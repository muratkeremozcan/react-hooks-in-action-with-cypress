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

  // @FF_dateAndWeek
  // https://github.com/cypress-io/cypress/issues/18662
  // Stubbing modules isn't working in the component runner. The same thing is ok in the e2e runner. Wait for Cy 10
  // TODO: once stubbing works in Cypress 10, try to stub the LaunchDarkly hook
  // https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/stubbing-spying__functions
  /*

  import * as LD from 'launchdarkly-react-client-sdk'

  cy.stub(LD, 'useFlags).returns({ 'date-and-week': true })

  */
  it.skip('should render the week interval and today', () => {
    cy.getByCy('today').click()

    cy.getByCy('week-interval').should(
      'contain',
      dayjs().startOf('week').$d.toDateString()
    )
  })
})

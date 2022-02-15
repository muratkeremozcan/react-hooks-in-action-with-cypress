import BookingsGrid from './BookingsGrid'
import { mount } from '@cypress/react'
import { getWeek } from '../../utils/date-wrangler'
import dayjs from 'dayjs'
import '../../App.css'

describe('BookingsGrid', () => {
  it('should render correctly', () => {
    const title = 'bookable title yo'
    const week = getWeek(new Date())

    // https://www.regextester.com/112232
    const isoRegex =
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)((-(\d{2}):(\d{2})|Z)?)$/
    mount(<BookingsGrid bookable={{ title }} week={week} />)

    cy.log(dayjs().startOf('week').toISOString())
    cy.getByCy('bookings-grid')
      .should('be.visible')
      .contains(title)
      .contains(isoRegex)
  })
})

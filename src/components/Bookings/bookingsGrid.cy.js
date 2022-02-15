import BookingsGrid from './BookingsGrid'
import { mount } from '@cypress/react'
import { getWeek } from '../../utils/date-wrangler'
import { isoRegex } from '../../utils/regex'
import '../../App.css'

describe('BookingsGrid', () => {
  it('should render correctly', () => {
    const title = 'bookable title yo'
    const week = getWeek(new Date())
    mount(<BookingsGrid bookable={{ title }} week={week} />)

    cy.getByCy('bookings-grid')
      .should('be.visible')
      .contains(title)
      .contains(isoRegex)
  })
})

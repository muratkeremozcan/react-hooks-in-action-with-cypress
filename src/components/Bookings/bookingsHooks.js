import { useMemo } from 'react'
import { shortISO } from '../../utils/date-wrangler'
import useFetch from '../../utils/useFetch'
import { getGrid, transformBookings } from './grid-builder'

/** Uses the bookableId and the startDate and endDate values converted to strings,
 * start and end, to build the URL for the specific data we want,
 * in a format that our data server, json-server, understands.
 * Returns an object with bookings, data, status and error values */
export function useBookings(bookableId, startDate, endDate) {
  const start = shortISO(startDate)
  const end = shortISO(endDate)

  const urlRoot = 'http://localhost:3001/bookings'

  const queryString =
    `bookableId=${bookableId}` + `&date_gte=${start}&date_lte=${end}`

  const query = useFetch(`${urlRoot}?${queryString}`)

  return {
    bookings: query.data ? transformBookings(query.data) : {},
    ...query
  }
}

/** Each bookable can be booked only on certain days of the week and for certain sessions during the day.
 * The BookingsGrid component displays the appropriate grid for the current bookable.
 * To run the grid creation logic only when the bookable changes, we wrap the call to getGrid in the useMemo hook */
export function useGrid(bookable, startDate) {
  return useMemo(
    () => (bookable ? getGrid(bookable, startDate) : {}),
    [bookable, startDate]
  )
}

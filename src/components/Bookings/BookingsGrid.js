import { useEffect, useMemo, useState } from 'react'
import { getGrid, transformBookings } from './grid-builder'
import { getBookings } from '../../utils/api'
import Spinner from '../UI/Spinner'

export default function BookingsGrid({ week, bookable, booking, setBooking }) {
  const [bookings, setBookings] = useState(null)
  const [error, setError] = useState(false)

  // [7.1] wrap expensive functions in useMemo and provide an array of dependencies
  // this way we use memoization; if the function is called with the same args, it returns the stored value.
  // const memoizedValue = useMemo(() => expensiveFunction(arg1, arg2), [arg1, arg2])
  const { grid, sessions, dates } = useMemo(
    () => (bookable ? getGrid(bookable, week.start) : {}),
    [bookable, week.start]
  )

  // [7.2] When fetching data within a call to useEffect, combine a local variable and the cleanup function
  // in order to match a data request with its response:
  // If the component re-renders, the cleanup function for the previous render will set the previous render’s doUpdate variable to false,
  // preventing the previous then method callback from performing updates with stale data.
  /*
    useEffect(() => {
      let doUpdate = true;

      fetch(url).then(resp => {
        if (doUpdate) {
          // perform update with resp
        }
      });

      return () => doUpdate = false;
    }, [url]);
  */
  useEffect(() => {
    if (bookable) {
      let doUpdate = true

      setBookings(null)
      setError(false)
      setBooking(null)

      getBookings(bookable.id, week.start, week.end)
        .then((resp) => {
          if (doUpdate) {
            setBookings(transformBookings(resp))
          }
        })
        .catch(setError)

      return () => (doUpdate = false)
    }
  }, [week, bookable, setBooking])

  function cell(session, date) {
    const cellData = bookings?.[session]?.[date] || grid[session][date]

    const isSelected = booking?.session === session && booking?.date === date

    return (
      <td
        data-cy={`${session}-${date}`}
        key={date}
        className={isSelected ? 'selected' : null}
        onClick={bookings ? () => setBooking(cellData) : null}
      >
        {cellData.title}
      </td>
    )
  } /*  */

  if (!grid) {
    return <p data-cy="loading">Loading...</p>
  }

  return (
    <>
      {error && (
        <p data-cy="error" className="bookingsError">
          {`There was a problem loading the bookings data (${error})`}
        </p>
      )}
      <table
        data-cy="bookings-grid"
        className={bookings ? 'bookingsGrid active' : 'bookingsGrid'}
      >
        <thead>
          <tr>
            <th>
              <span className="status">
                <Spinner />
              </span>
            </th>
            {dates.map((d, i) => (
              <th data-cy={`date-${i}`} key={d}>
                {new Date(d).toDateString()}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {sessions.map((session, i) => (
            <tr data-cy={`session-${i}`} key={session}>
              <th>{session}</th>
              {dates.map((date) => cell(session, date))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

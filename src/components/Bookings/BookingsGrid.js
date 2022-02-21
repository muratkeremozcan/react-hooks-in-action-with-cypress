import { useBookings, useGrid } from './bookingsHooks'
import Spinner from '../UI/Spinner'

export default function BookingsGrid({ week, bookable, booking, setBooking }) {
  // const [bookings, setBookings] = useState(null)
  // const [error, setError] = useState(false)
  // [9.5.1] using the custom hook, we can simplify the state
  const { bookings, status, error } = useBookings(
    bookable?.id,
    week.start,
    week.end
  )

  // [7.1] wrap expensive functions in useMemo and provide an array of dependencies
  // this way we use memoization; if the function is called with the same args, it returns the stored value.
  // const memoizedValue = useMemo(() => expensiveFunction(arg1, arg2), [arg1, arg2])
  // const { grid, sessions, dates } = useMemo(
  //   () => (bookable ? getGrid(bookable, week.start) : {}),
  //   [bookable, week.start]
  // )
  // (9.5.1) the custom hook is the same function as the above
  const { grid, sessions, dates } = useGrid(bookable, week.start)

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
  // useEffect(() => {
  //   if (bookable) {
  //     let doUpdate = true

  //     setBookings(null)
  //     setError(false)
  //     setBooking(null)

  //     getBookings(bookable.id, week.start, week.end)
  //       .then((resp) => {
  //         if (doUpdate) {
  //           setBookings(transformBookings(resp))
  //         }
  //       })
  //       .catch(setError)

  //     return () => (doUpdate = false)
  //   }
  // }, [week, bookable, setBooking])
  // (9.5.1) the above is handled by useFetch within useBookings

  function cell(session, date) {
    const cellData = bookings?.[session]?.[date] || grid[session][date]

    const isSelected = booking?.session === session && booking?.date === date

    return (
      <td
        data-cy={`${session}-${date}`}
        key={date}
        className={isSelected ? 'selected' : null}
        onClick={status === 'success' ? () => setBooking(cellData) : null}
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
        className={
          status === 'success' ? 'bookingsGrid active' : 'bookingsGrid'
        }
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

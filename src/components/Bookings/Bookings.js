import { useEffect, useState } from 'react'

import { getWeek, shortISO } from '../../utils/date-wrangler'
import { useBookingsParams, useBookings } from './bookingsHooks'

import WeekPicker from './WeekPicker'
import BookingsGrid from './BookingsGrid'
import BookingDetails from './BookingDetails'

// import weekReducer from './weekReducer'

export default function Bookings({ bookable }) {
  // [3.1] utilize useReducer instead of useState on multiple pieces of state
  // const [state, dispatch] = useReducer(reducer, initialState)
  // [3.2] useReducer init function: useReducer can also take an init function (similar to useState's lazy initial state at (2.1))
  // const [state, dispatch] = useReducer(reducer, initArgument, initFunction)
  // [3.3] create dispatch functions for for the reducer
  // Use the dispatch function to dispatch an action. dispatch takes an object with type and payload properties
  // React will pass the dispatch to the reducer, reducer generates new state, React replaces the state old state with the new.
  // ch(6.0) manage the shared state between the child components
  // const [week, dispatch] = useReducer(weekReducer, new Date(), getWeek)

  const [booking, setBooking] = useState(null)

  // [10.3.3] access the query string's search params
  const { date } = useBookingsParams()
  const week = getWeek(date)
  const weekStart = shortISO(week.start)

  const { bookings } = useBookings(bookable?.id, week.start, week.end)
  const selectedBooking = bookings?.[booking?.session]?.[booking.date]

  // set the currently selected booking null if the start date changes
  useEffect(() => setBooking(null), [bookable, weekStart])

  return (
    <div data-cy="bookings" className="bookings">
      <div>
        {/*[3.4] Use the dispatch function to dispatch an action 
        dispatch takes an object with type and payload properties */}
        {/* <WeekPicker dispatch={dispatch} week={week} /> */}
        <WeekPicker />

        <BookingsGrid
          week={week}
          bookable={bookable}
          booking={booking}
          setBooking={setBooking}
        />

        <BookingDetails
          booking={selectedBooking || booking}
          bookable={bookable}
        />
      </div>
    </div>
  )
}

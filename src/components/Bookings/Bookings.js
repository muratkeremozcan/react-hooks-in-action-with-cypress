import { useReducer, useState } from 'react'
import dayjs from 'dayjs'
import { getWeek } from '../../utils/date-wrangler'

import WeekPicker from './WeekPicker'
import BookingsGrid from './BookingsGrid'
import BookingDetails from './BookingDetails'

import weekReducer from './weekReducer'

export default function Bookings({ bookable }) {
  // [3.1] utilize useReducer instead of useState on multiple pieces of state
  // const [state, dispatch] = useReducer(reducer, initialState)
  // [3.2] useReducer init function: useReducer can also take an init function (similar to useState's lazy initial state at (2.1))
  // const [state, dispatch] = useReducer(reducer, initArgument, initFunction)
  // [3.3] create dispatch functions for for the reducer
  // Use the dispatch function to dispatch an action. dispatch takes an object with type and payload properties
  // React will pass the dispatch to the reducer, reducer generates new state, React replaces the state old state wit the new.
  // ch(6.0) manage the shared state between the child components
  const [week, dispatch] = useReducer(weekReducer, new Date(), getWeek)
  const [booking, setBooking] = useState(null)

  console.log(week)
  console.log(dayjs())
  return (
    <div data-cy="bookings" className="bookings">
      <div>
        {/*[3.4] Use the dispatch function to dispatch an action 
        dispatch takes an object with type and payload properties */}
        {/* week is @FeatureFlag candidate, how do we handle that in a prop? */}
        <WeekPicker dispatch={dispatch} week={week} />

        <BookingsGrid
          week={week}
          bookable={bookable}
          booking={booking}
          setBooking={setBooking}
        />
        <BookingDetails booking={booking} bookable={bookable} />
      </div>
    </div>
  )
}

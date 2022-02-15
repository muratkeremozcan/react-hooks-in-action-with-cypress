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
  const [week, dispatch] = useReducer(weekReducer, new Date(), getWeek)
  const [booking, setBooking] = useState(null)

  console.log(week)
  console.log(dayjs())
  return (
    <div className="bookings">
      <div>
        <WeekPicker />

        <BookingsGrid week={week} bookable={bookable} />
      </div>
    </div>
  )
}

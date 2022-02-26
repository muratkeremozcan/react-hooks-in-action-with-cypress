import { useRef, useState } from 'react'
import dayjs from 'dayjs'
import {
  FaChevronLeft,
  FaCalendarDay,
  FaChevronRight,
  FaCalendarCheck
} from 'react-icons/fa'

import { addDays, shortISO, getWeek } from '../../utils/date-wrangler'
import { useBookingsParams } from './bookingsHooks'

// week is @FeatureFlag candidate, how do we handle that in a prop?
export default function WeekPicker() {
  const today = () => dayjs().format('YYYY-MM-DD')
  const [dateText] = useState(today())

  // ch[5] note: controlled vs uncontrolled components
  // * uncontrolled components: component <- DOM . They read their state from the DOM.
  // ** reference variable is used to update the state (via dispatch or other handler functions), the ref attribute is used to access the state
  // * controlled components: component -> DOM
  // React recommends you use controlled components. Use the useState hook or the useReducer hook to manage the state

  // (5.1) create a variable to hold the reference; reference to the text box
  const textboxRef = useRef()
  // (5.2) use the reference in a handler function
  // const goToDate = () =>
  //   dispatch({
  //     type: 'SET_DATE',
  //     payload: textboxRef.current.value
  //   })

  const { date, setBookingsDate: goToDate } = useBookingsParams()
  const week = getWeek(date)

  const dates = {
    prev: shortISO(addDays(date, -7)),
    next: shortISO(addDays(date, 7)),
    today: shortISO(new Date())
  }

  return (
    <div data-cy="week-picker">
      <p className="date-picker" data-cy="date-picker">
        <button
          className="btn"
          data-cy="prev-week"
          onClick={() => goToDate(dates.prev)}
        >
          <FaChevronLeft />
          <span>Prev</span>
        </button>

        <button
          className="btn"
          data-cy="today"
          onClick={() => goToDate(dates.today)}
        >
          <FaCalendarDay />
          <span>Today</span>
        </button>

        <span>
          <input
            type="text"
            // (5.3) assign the reference variable to a ref attribute
            // the reference variable gets set by a dispatch; goToDate
            // after that, the component reads the state from the DOM using the ref attribute
            ref={textboxRef}
            // manage state with useState instead, for a controlled component approach; component -> DOM
            placeholder={`e.g. ${dateText}`}
            id="wpDate"
            defaultValue={dateText}
            data-cy="date-input"
          />

          <button
            className="go btn"
            data-cy="go-to-date"
            onClick={() => goToDate(textboxRef.current.value)}
          >
            <FaCalendarCheck /> <span>Go</span>
          </button>
        </span>

        <button
          className="btn"
          data-cy="next-week"
          onClick={() => goToDate(dates.next)}
        >
          <span>Next</span>
          <FaChevronRight />
        </button>
      </p>

      {/* @FeatureFlag candidate */}
      {/* <p data-cy="week-interval">
        {week?.start?.toDateString()} - {week?.end?.toDateString()}
      </p>
      <p data-cy="todays-date">The date is {week?.date?.toDateString()}</p> */}
    </div>
  )
}

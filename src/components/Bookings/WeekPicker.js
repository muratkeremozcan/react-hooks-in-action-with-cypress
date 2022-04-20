import { useRef, useState } from 'react'
import dayjs from 'dayjs'
import {
  FaChevronLeft,
  FaCalendarDay,
  FaChevronRight,
  FaCalendarCheck
} from 'react-icons/fa'
import { useFlags /*, useLDClient */ } from 'launchdarkly-react-client-sdk'
import { FLAGS } from '../../utils/flags'

import { addDays, shortISO, getWeek } from '../../utils/date-wrangler'
import { useBookingsParams } from './bookingsHooks'

export default function WeekPicker() {
  const today = () => dayjs().format('YYYY-MM-DD')
  const [dateText] = useState(today())
  const { [FLAGS.DATE_AND_WEEK]: FF_dateAndWeek } = useFlags()

  // const flags = useFlags()
  // const ldClient = useLDClient()

  // console.log('here are flags:', flags)
  // console.log('here is ldClient:', ldClient)

  // ch[5] note: controlled vs uncontrolled components
  // * uncontrolled components: component <- DOM . They read their state from the DOM.
  // ** reference variable is used to update the state (via dispatch or other handler functions), the ref attribute is used to access the state
  // * controlled components: component -> DOM
  // React recommends you use controlled components. Use the useState hook or the useReducer hook to manage the state

  // [5.0] useState vs useRef
  // useState: calling the updater function triggers a re-render
  // useRef: can update a value without a corresponding change to the UI
  // use the useRef hook when you want React to manage a state value but don’t want changes to the value to trigger a re-render
  // [5.1] create a variable to hold the reference
  // useRef returns an object with a .current property
  // if useRef has an argument, initially the arg passed to useRef is assigned to variable.current
  const textboxRef = useRef()

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
            // [5.3] assign the reference variable to a ref attribute
            // the component reads the state from the DOM using the ref attribute
            ref={textboxRef}
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

      {FF_dateAndWeek && (
        <p data-cy="week-interval">
          {week?.start?.toDateString()} - {week?.end?.toDateString()}
        </p>
      )}
    </div>
  )
}

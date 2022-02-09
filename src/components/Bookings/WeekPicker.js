import { useReducer, useState } from 'react'
import dayjs from 'dayjs'
import reducer from './weekReducer'
import { getWeek } from '../../utils/date-wrangler'
import {
  FaChevronLeft,
  FaCalendarDay,
  FaChevronRight,
  FaCalendarCheck
} from 'react-icons/fa'

// date is destructured because the data is:
// {date: Wed Feb 02 2022 05:59:38 GMT-0600 (Central Standard Time)}

export default function WeekPicker({ date }) {
  // [3.3] useReducer can also take an init function (similar to useState lazy initial state at (2.1))
  // const [state, dispatch] = useReducer(reducer, initArgument, initFunction)
  // here week/state is {date: x, start: y, end: z}
  const [week, dispatch] = useReducer(reducer, date, getWeek)

  const today = () => dayjs().format('YYYY-MM-DD')

  // While the WeekPicker example demonstrates how to use a ref with a form field,
  // the approach doesn’t really fit with the philosophy of managing state with useState and useReducer
  // and then displaying that state in the UI.
  // React recommends using controlled components that make the most of React’s help managing the state.
  // With controlled components, the data flow is from the component to the DOM, in line with the standard React approach.
  const [dateText, setDateText] = useState(today())
  // (5.1) create a variable to hold the reference; reference to the text box
  // const textboxRef = useRef()
  // (5.2) use the reference in a handler function
  const goToDate = () =>
    dispatch({
      type: 'SET_DATE',
      // manage state with useState instead, for a controlled component approach
      // payload: textboxRef.current.value
      payload: dateText
    })

  return (
    <div>
      <p className="date-picker" data-cy="date-picker">
        <button
          className="btn"
          data-cy="prev-week"
          onClick={() => dispatch({ type: 'PREV_WEEK' })}
        >
          <FaChevronLeft />
          <span>Prev</span>
        </button>

        <button
          className="btn"
          data-cy="today"
          onClick={() => dispatch({ type: 'TODAY' })}
        >
          <FaCalendarDay />
          <span>Today</span>
        </button>

        <span>
          <input
            type="text"
            // (5.3) assign the reference to a ref attribute
            // ref={textboxRef}
            // manage state with useState instead, for a controlled component approach
            onChange={(e) => setDateText(e.target.value)}
            placeholder={`e.g. ${dateText}`}
            defaultValue={dateText}
            data-cy="date-input"
          />

          <button className="go btn" data-cy="go-to-date" onClick={goToDate}>
            <FaCalendarCheck /> <span>Go</span>
          </button>
        </span>

        <button
          className="btn"
          data-cy="next-week"
          onClick={() => dispatch({ type: 'NEXT_WEEK' })}
        >
          <span>Next</span>
          <FaChevronRight />
        </button>
      </p>
      <p data-cy="date">
        {week.start.toDateString()} - {week.end.toDateString()}
      </p>
      <p>The date is {week.date.toDateString()}</p>
    </div>
  )
}

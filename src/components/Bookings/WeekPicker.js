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
  // [3.1] utilize useReducer instead of useState on multiple pieces of state
  // const [state, dispatch] = useReducer(reducer, initialState)

  // [3.2] useReducer init function: useReducer can also take an init function (similar to useState's lazy initial state at (2.1))
  // const [state, dispatch] = useReducer(reducer, initArgument, initFunction)
  // here week/state is {date: x, start: y, end: z}
  const [week, dispatch] = useReducer(reducer, date, getWeek)

  const today = () => dayjs().format('YYYY-MM-DD')

  // ch[5] note: controlled vs uncontrolled components
  // * uncontrolled components: component <- DOM . They read their state from the DOM.
  // ** reference variable is used to update the state (via dispatch or other handler functions), the ref attribute is used to access the state
  // * controlled components: component -> DOM
  // React recommends you use controlled components. Use the useState hook or the useReducer hook to manage the state

  const [dateText, setDateText] = useState(today())
  // (5.1) create a variable to hold the reference; reference to the text box
  // const textboxRef = useRef()
  // (5.2) use the reference in a handler function
  // [3.3] create dispatch functions for for the reducer
  // Use the dispatch function to dispatch an action. dispatch takes an object with type and payload properties
  // React will pass the dispatch to the reducer, reducer generates new state, React replaces the state old state wit the new.
  /// note the the functions that take an argument have a payload in the reducer
  const goToDate = () =>
    dispatch({
      type: 'SET_DATE',
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
            // (5.3) assign the reference variable to a ref attribute
            // the reference variable gets set by a dispatch; goToDate
            // after that, the component reads the state from the DOM using the ref attribute
            // ref={textboxRef}
            // manage state with useState instead, for a controlled component approach; component -> DOM
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
      <p data-cy="week-interval">
        {week.start.toDateString()} - {week.end.toDateString()}
      </p>
      <p data-cy="todays-date">The date is {week.date.toDateString()}</p>
    </div>
  )
}

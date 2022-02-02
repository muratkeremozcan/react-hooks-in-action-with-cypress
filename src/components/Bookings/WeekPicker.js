import { useReducer } from 'react'
import reducer from './weekReducer'
import { getWeek } from '../../utils/date-wrangler'
import { FaChevronLeft, FaCalendarDay, FaChevronRight } from 'react-icons/fa'

// date is destructured because the data is:
// {date: Wed Feb 02 2022 05:59:38 GMT-0600 (Central Standard Time)}

export default function WeekPicker({ date }) {
  // [3.3] useReducer can also take an init function (similar to useState lazy initial state at (2.1))
  // const [state, dispatch] = useReducer(reducer, initArgument, initFunction)
  // here week/state is {date: x, start: y, end: z}
  const [week, dispatch] = useReducer(reducer, date, getWeek)

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
      <p>Today is {week.date.toDateString()}</p>
    </div>
  )
}

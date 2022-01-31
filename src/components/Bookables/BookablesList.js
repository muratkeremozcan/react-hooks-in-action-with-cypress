import { bookables, sessions, days } from '../../static.json'
import { useReducer } from 'react'
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'
import reducer from './reducer'

/* [2.0] Why useState?
 We want to alert React that a value used within a component has changed
 so it can rerun the component and update the UI.
 Just updating the variable directly won’t do.
 We need a way of changing that value, some kind of updater function,
 that triggers React to call the component with the new value and get the updated UI

 The approach
 ❶ Consider what state the component needs
 ❷ Display the state
 ❸ Update the state in response to events

 function Counter () {
  const [count, setCount] = useState(0); // 1

  return (
    <p>{count} // 2
      <button onClick={() => setCount(c => c + 1)}> + </button> // 3
    </p>
  );
}
*/

const initialState = {
  group: 'Rooms',
  bookableIndex: 0,
  hasDetails: true,
  bookables
}

export default function BookablesList() {
  // [3.1] Use a reducer instead of useState on multiple pieces of state
  // the component has 4 pieces of state: group, bookableIndex, hasDetails, and bookables (from json)
  // assign state values to local variables
  const [{ group, bookableIndex, bookables, hasDetails }, dispatch] =
    useReducer(reducer, initialState)

  // [2.1] calling useState returns a value and its updater function in an array of 2, the names are arbitrary
  // if you want an initial value for the variable, pass it as an argument to the useState
  // const [value, setValue] = useState(initialValue);
  // const [group, setGroup] = useState('Rooms')
  /*
  note: the useState hook also accepts a function as its argument, a lazy initial state
  Use the lazy initial state if you need to undertake expensive work to generate an initial value
  const [value, setValue] = useState(() => {
    return initialState
  })

  could do this too... but no
   const bookableIndexArray = useState()
   const bookableIndex = bookableIndexArray[0]
   const setBookableIndex = bookableIndexArray[1] */
  // const [bookableIndex, setBookableIndex] = useState(0)

  /** filter by group, Rooms or Kit */
  const bookablesInGroup = bookables.filter((b) => b.group === group)

  const bookable = bookablesInGroup[bookableIndex]

  /** uses a set to ignore the duplicates, converts to an array with [... ] */
  const groups = [...new Set(bookables.map((b) => b.group))]

  // [2.2] Updater function: when we want to update a state value based on a previous value, we can pass it a fn
  // React passes that fn to the current state value, and uses the return value as the new state Value
  // setValue(oldValue => newValue)
  // const [hasDetails, setHasDetails] = useState(false)
  /*
  note: if your state value is an object, make sure you copy over the unchanged properties
  setValue(prevState => {
    return {
      ...prevState,
      property: newValue
    }
  })
  */

  const setGroup = (e) =>
    dispatch({
      type: 'SET_GROUP',
      payload: e.target.value
    })

  /** When the group changes, default the index to 0  */
  const setBookable = (selectedIndex) =>
    dispatch({
      type: 'SET_BOOKABLE',
      payload: selectedIndex
    })

  /** event handler for the next button */
  const nextBookable = () => dispatch({ type: 'NEXT_BOOKABLE' })

  /** event handler for the previous button */
  const previousBookable = () => dispatch({ type: 'PREVIOUS_BOOKABLE' })

  const toggleDetails = () => dispatch({ type: 'TOGGLE_HAS_DETAILS' })

  return (
    <>
      <div>
        <select value={group} onChange={setGroup}>
          {groups.map((g) => (
            <option value={g} key={g}>
              {g}
            </option>
          ))}
        </select>
        <ul className="bookables items-list-nav" data-cy="bookables-list">
          {bookablesInGroup.map((b, i) => (
            <li key={b.id} className={i === bookableIndex ? 'selected' : null}>
              <button className="btn" onClick={() => setBookable(i)}>
                {b.title}
              </button>
            </li>
          ))}
        </ul>
        <p>
          <button
            className="btn"
            onClick={previousBookable}
            autoFocus
            data-cy="prev-btn"
          >
            <FaArrowLeft /> <span>Previous</span>
          </button>

          <button
            className="btn"
            onClick={nextBookable}
            autoFocus
            data-cy="next-btn"
          >
            <FaArrowRight /> <span>Next</span>
          </button>
        </p>
      </div>

      {bookable && (
        <div className="bookable-details">
          <div className="item">
            <div className="item-header">
              <h2>{bookable.title}</h2>
              <span className="controls">
                <label>
                  <input
                    type="checkbox"
                    checked={hasDetails}
                    onChange={toggleDetails}
                    data-cy="show-details"
                  />
                  Show Details
                </label>
              </span>
            </div>

            <p>{bookable.notes}</p>
            {hasDetails && (
              <div className="item-details">
                <h3>Availability</h3>
                <div className="bookable-availability">
                  <ul>
                    {bookable.days.sort().map((d) => (
                      <li key={d}>{days[d]}</li>
                    ))}
                  </ul>
                  <ul>
                    {bookable.sessions.map((s) => (
                      <li key={s}>{sessions[s]}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

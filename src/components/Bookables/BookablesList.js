import { useReducer, useEffect, useRef } from 'react'
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'
import Spinner from '../UI/Spinner'
import reducer from './reducer'
import getData from '../../utils/api'
import { sessions, days } from '../../static.json'

/* [2.0] Why useState?
 we want to alert React that a value used within a component has changed
 just updating the variable directly won’t do, need an updater function,

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
  bookables: [],
  isLoading: false,
  error: false
}

export default function BookablesList() {
  // [2.1] useState returns a value & its updater function in an array of 2, the names are arbitrary
  // if you want an initial value for the variable, pass it as an argument to the useState
  // const [value, setValue] = useState(initialValue);
  /*
  note: the useState hook also accepts a function as its argument, a lazy initial state
  Use the lazy initial state if you need to undertake expensive work to generate an initial value
  Example at [4.1] , or search for (2.1) reference
  const [value, setValue] = useState(() => {
    return initialState
  })

  instead of destructuring, could do this too... but no
  const bookableIndexArray = useState()
  const bookableIndex = bookableIndexArray[0]
  const setBookableIndex = bookableIndexArray[1] */

  // [2.2] Updater function: when we want to update a state value based on a previous value, we can pass it a fn
  // React passes that fn to the current state value, and uses the return value as the new state Value
  // setValue(oldValue => newValue)
  // in ch2 we used this, in ch3 we used dispatch instead (compare to (3.4))
  // const nextBookable = () =>
  //   setBookableIndex((i) => (i + 1) % bookablesInGroup.length)

  /*
  note: if your state value is an object, make sure you copy over the unchanged properties (reducers have to do this)
  setValue(prevState => {
    return {
      ...prevState,
      property: newValue
    }
  })
  */

  // these are useState from ch2... In ch3 we combined these multiple pieces of state with useReducer
  // const [group, changeGroup] = useState('Rooms')
  // const [bookableIndex, setBookableIndex] = useState(0)
  // const [hasDetails, setHasDetails] = useState(false)

  // [3.1] Use a reducer instead of useState on multiple pieces of state
  // the component has 4 pieces of state: group, bookableIndex, hasDetails, and bookables (from json) (and more in later chapters)
  // assign state values to local variables
  // const [state, dispatch] = useReducer(reducer, initialState)
  const [
    { group, bookableIndex, bookables, hasDetails, isLoading, error },
    dispatch
  ] = useReducer(reducer, initialState)

  /** filter by group, Rooms or Kit */
  const bookablesInGroup = bookables.filter((b) => b.group === group)

  /** the entity we want to book, any of the rooms or kits */
  const bookable = bookablesInGroup[bookableIndex]

  /** uses a set to ignore the duplicates, converts to an array with [... ] */
  const groups = [...new Set(bookables.map((b) => b.group))]

  // [4.6] useEffect with fetch & useReducer instead of useState
  useEffect(() => {
    // dispatch an action for the start of the data fetching
    dispatch({ type: 'FETCH_BOOKABLES_REQUEST' })

    getData('http://localhost:3001/bookables')
      .then((data) =>
        dispatch({
          type: 'FETCH_BOOKABLES_SUCCESS',
          payload: data
        })
      )
      .catch((err) =>
        dispatch({
          type: 'FETCH_BOOKABLES_ERROR',
          payload: err
        })
      )
  }, [])

  // [5.0] useState vs useRef
  // useState: calling the updater function triggers a re-render
  // useRef: can update a value without a corresponding change to the UI
  // use the useRef hook when you want React to manage a state value but don’t want changes to the value to trigger a re-render
  // [5.1] create a variable to hold the reference
  // useRef returns an object with a .current property
  // initially the arg passed to useRef is assigned to variable.current
  // passing null because there is no timer initially
  const timerRef = useRef(null)

  // [5.2] use the ref in a handler function
  /** clears the setInterval timer */
  const stopPresentation = () => clearInterval(timerRef.current)

  useEffect(() => {
    // [5.2.2] assigning new values to the current properties of the ref objects doesn’t trigger a re-render.
    // you can persist state values by assigning them to variable.current
    timerRef.current = setInterval(() => nextBookable(), 3000)

    // clean up function is called onClick, or when the component unmounts (user navigates away)
    return stopPresentation
  }, [])

  // (5.0)
  // let React automatically assign a value to the nextButtonRef.current
  const nextButtonRef = useRef()

  // [3.2] create dispatch functions for for the reducer
  // Use the dispatch function to dispatch an action. React will pass the current state and the action to the reducer.
  // It will replace the state with the new state generated by the reducer.It will re-render if the state has changed.
  /// note the the functions that take an argument have a payload in the reducer
  /// an action is an object of type & payload; dispatch({ type: 'SET_NAME', payload: 'Jamal' })

  /** sets the group: rooms or kit */
  const changeGroup = (e) =>
    dispatch({
      type: 'SET_GROUP',
      payload: e.target.value
    })

  /** When the group changes, default the index to 0  */
  const changeBookable = (selectedIndex) => {
    dispatch({
      type: 'SET_BOOKABLE',
      payload: selectedIndex
    })
    // (5.2) use the ref in a handler function
    // Once React has created the button element for the DOM, it assigns a reference to the element to nextButtonRef.current
    // We use that reference in the changeBookable function to focus the button by calling the element’s focus method
    // this way, whenever changeBookable is called, the focus is on Next button
    return nextButtonRef.current.focus()
  }

  const toggleDetails = () => dispatch({ type: 'TOGGLE_HAS_DETAILS' })

  /** event handler for the next button */
  const nextBookable = () => dispatch({ type: 'NEXT_BOOKABLE' })

  /** event handler for the previous button */
  const previousBookable = () => dispatch({ type: 'PREVIOUS_BOOKABLE' })

  // conditional rendering
  if (error) {
    return <p data-cy="error">{error.message}</p>
  }

  if (isLoading) {
    return (
      <p>
        <Spinner /> Loading bookables...
      </p>
    )
  }

  return (
    <>
      <div data-cy="BookablesList">
        <select value={group} onChange={changeGroup}>
          {groups.map((g) => (
            <option value={g} key={g}>
              {g}
            </option>
          ))}
        </select>

        <ul className="bookables items-list-nav" data-cy="bookables-list">
          {bookablesInGroup.map((b, i) => (
            <li key={b.id} className={i === bookableIndex ? 'selected' : null}>
              <button className="btn" onClick={() => changeBookable(i)}>
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
            // [5.3] assign the reference variable to a ref attribute
            // the reference variable gets set by a dispatch; changeBookable
            // after that, the component reads the state from the DOM using the ref attribute
            ref={nextButtonRef}
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
                <button
                  className="btn"
                  data-cy="stop"
                  onClick={stopPresentation}
                >
                  Stop
                </button>
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

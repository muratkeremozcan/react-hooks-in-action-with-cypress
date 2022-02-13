import { useState, useEffect, useReducer, useRef } from 'react'
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'
import Spinner from '../UI/Spinner'
import getData from '../../utils/api'
import reducer from './reducer'

const initialState = {
  bookables: [],
  isLoading: true,
  error: false
}

export default function BookablesList({ bookable, setBookable }) {
  // Feature Flag candidate
  // [3.1.0] useState vs useReducer comparison
  // const [bookables, setBookables] = useState([])
  // const [isLoading, setIsLoading] = useState(true)
  // const [error, setError] = useState(false)

  const group = bookable?.group

  // [3.1.1] Use a reducer instead of useState on multiple pieces of state
  // const [state, dispatch] = useReducer(reducer, initialState)
  // the component has 4 pieces of state: group, bookableIndex, hasDetails, bookables (from json), isLoading, error
  // assign state values to local variables
  const [{ bookables, isLoading, error }, dispatch] = useReducer(
    reducer,
    initialState
  )

  const bookablesInGroup = bookables.filter((b) => b.group === group)
  const groups = [...new Set(bookables.map((b) => b.group))]

  // Feature Flag candidate
  // useEffect(() => {
  //   getData('http://localhost:3001/bookables')
  //     .then((bookables) => {
  //       setBookable(bookables[0])
  //       setBookables(bookables)
  //       setIsLoading(false)
  //     })

  //     .catch((error) => {
  //       setError(error)
  //       setIsLoading(false)
  //     })
  // }, [setBookable])

  // [4.6] useEffect with fetch & useReducer instead of useState
  useEffect(() => {
    // dispatch an action for the start of the data fetching
    dispatch({ type: 'FETCH_BOOKABLES_REQUEST' })

    getData('http://localhost:3001/bookables')
      .then((data) => {
        setBookable(bookables[0])
        return dispatch({
          type: 'FETCH_BOOKABLES_SUCCESS',
          payload: data
        })
      })
      .catch((err) =>
        dispatch({
          type: 'FETCH_BOOKABLES_ERROR',
          payload: err
        })
      )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setBookable])

  // [5.0] useState vs useRef
  // useState: calling the updater function triggers a re-render
  // useRef: can update a value without a corresponding change to the UI
  // use the useRef hook when you want React to manage a state value but don’t want changes to the value to trigger a re-render
  // [5.1] create a variable to hold the reference
  // useRef returns an object with a .current property
  // initially the arg passed to useRef is assigned to variable.current
  // passing null because there is no timer initially
  const nextButtonRef = useRef()

  // Feature flag candidate (slide show)
  /*
    const timerRef = useRef(null)

    // [5.2] use the ref in a handler function
    // clears the setInterval timer 
    const stopPresentation = () => clearInterval(timerRef.current)

    useEffect(() => {
      // [5.2.2] assigning new values to the current properties of the ref objects doesn’t trigger a re-render.
      // you can persist state values by assigning them to variable.current
      timerRef.current = setInterval(() => nextBookable(), 3000)

      // clean up function is called onClick, or when the component unmounts (user navigates away)
      return stopPresentation
    }, [])
  */

  // Feature Flag candidate
  // [3.1.0] useState vs useReducer comparison
  // function changeGroup(e) {
  //   const bookablesInSelectedGroup = bookables.filter(
  //     (b) => b.group === e.target.value
  //   )
  //   setBookable(bookablesInSelectedGroup[0])
  // }

  // function changeBookable(selectedBookable) {
  //   setBookable(selectedBookable)
  //   nextButtonRef.current.focus()
  // }

  // function nextBookable() {
  //   const i = bookablesInGroup.indexOf(bookable)
  //   const nextIndex = (i + 1) % bookablesInGroup.length
  //   const nextBookable = bookablesInGroup[nextIndex]
  //   setBookable(nextBookable)
  // }

  // [3.2] create dispatch functions for for the reducer
  // Use the dispatch function to dispatch an action. dispatch takes an object with type and payload properties
  // React will passes the dispatch to the reducer, reducer generates new state, React replaces the state old state wit the new.
  /// note the the functions that take an argument have a payload in the reducer

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

  /** event handler for the next button */
  const nextBookable = () => dispatch({ type: 'NEXT_BOOKABLE' })

  // Feature flag candidate (previous Button)
  /** event handler for the previous button */
  // const previousBookable = () => dispatch({ type: 'PREVIOUS_BOOKABLE' })

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
    <div data-cy="bookables-list">
      <select value={group} onChange={changeGroup}>
        {groups.map((g) => (
          <option value={g} key={g}>
            {g}
          </option>
        ))}
      </select>

      <ul className="bookables items-list-nav">
        {bookablesInGroup.map((b) => (
          <li key={b.id} className={b.id === bookable.id ? 'selected' : null}>
            <button className="btn" onClick={() => changeBookable(b)}>
              {b.title}
            </button>
          </li>
        ))}
      </ul>
      <p>
        {/* <button
          className="btn"
          onClick={previousBookable}
          autoFocus
          data-cy="prev-btn"
        >
          <FaArrowLeft /> <span>Previous</span>
        </button> */}

        <button
          className="btn"
          onClick={nextBookable}
          ref={nextButtonRef}
          autoFocus
        >
          <FaArrowRight />
          <span data-cy="next" className="">
            Next
          </span>
        </button>
      </p>
    </div>
  )
}

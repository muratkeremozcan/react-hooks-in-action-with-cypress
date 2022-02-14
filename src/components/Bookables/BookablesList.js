import { useState, useEffect, useRef } from 'react'
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'
import Spinner from '../UI/Spinner'
import getData from '../../utils/api'
import mod from '../../utils/real-modulus'

export default function BookablesList({ bookable, setBookable }) {
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [bookables, setBookables] = useState([])

  const group = bookable?.group

  const bookablesInGroup = bookables.filter((b) => b.group === group)
  const groups = [...new Set(bookables.map((b) => b.group))]

  useEffect(() => {
    getData('http://localhost:3001/bookables')
      .then((bookables) => {
        setBookable(bookables[0])
        setBookables(bookables)
        setIsLoading(false)
      })

      .catch((error) => {
        setError(error)
        setIsLoading(false)
      })
  }, [setBookable])

  // [5.0] useState vs useRef
  // useState: calling the updater function triggers a re-render
  // useRef: can update a value without a corresponding change to the UI
  // use the useRef hook when you want React to manage a state value but don’t want changes to the value to trigger a re-render
  // [5.1] create a variable to hold the reference
  // useRef returns an object with a .current property
  // initially the arg passed to useRef is assigned to variable.current
  const nextButtonRef = useRef()

  function changeGroup(e) {
    const bookablesInSelectedGroup = bookables.filter(
      (b) => b.group === e.target.value
    )
    return setBookable(bookablesInSelectedGroup[0])
  }

  /** When the group changes, default the index to 0  */
  function changeBookable(selectedBookable) {
    setBookable(selectedBookable)
    // [5.2] use the ref in a handler function
    // Once React has created the button element for the DOM, it assigns a reference to the element to nextButtonRef.current
    // We use that reference in the changeBookable function to focus the button by calling the element’s focus method
    // this way, whenever changeBookable is called, the focus is on Next button
    return nextButtonRef.current.focus()
  }

  function nextBookable() {
    const i = bookablesInGroup.indexOf(bookable)
    const nextIndex = mod(i + 1, bookablesInGroup.length)
    const nextBookable = bookablesInGroup[nextIndex]

    return setBookable(nextBookable)
  }

  // @featureFlag candidate (slide show)
  /*
    // passing null because there is no timer initially
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

  // @featureFlag candidate (previous Button) (convert to useState instead)
  function previousBookable() {
    const i = bookablesInGroup.indexOf(bookable)
    const prevIndex = mod(i - 1, bookablesInGroup.length)
    const prevBookable = bookablesInGroup[prevIndex]

    return setBookable(prevBookable)
  }

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
        {bookablesInGroup.map((b, i) => (
          <li
            data-cy={`bookable-list-item-${i}`}
            key={b.id}
            className={b.id === bookable.id ? 'selected' : null}
          >
            <button className="btn" onClick={() => changeBookable(b)}>
              {b.title}
            </button>
          </li>
        ))}
      </ul>
      <p>
        {/* @FeatureFlag candidate */}
        <button
          className="btn"
          onClick={previousBookable}
          autoFocus
          data-cy="prev-btn"
        >
          <FaArrowLeft />
          <span>Previous</span>
        </button>

        <button
          className="btn"
          onClick={nextBookable}
          // [5.3] assign the reference variable to a ref attribute
          // the reference variable gets set by changeBookable
          // after that, the component reads the state from the DOM using the ref attribute
          ref={nextButtonRef}
          autoFocus
          data-cy="next-btn"
        >
          <FaArrowRight />
          <span>Next</span>
        </button>
      </p>
    </div>
  )
}

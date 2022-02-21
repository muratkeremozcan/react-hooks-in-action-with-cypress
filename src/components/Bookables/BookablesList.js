import { useEffect, useRef } from 'react'
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'
import Spinner from '../UI/Spinner'
import useFetch from '../../utils/useFetch'
import mod from '../../utils/real-modulus'

// [6.2] child components destructure and use the props
export default function BookablesList({ bookable, setBookable }) {
  // const [error, setError] = useState(false)
  // const [isLoading, setIsLoading] = useState(true)
  // const [bookables, setBookables] = useState([])
  // [9.5.1] using the custom hook, we can simplify the state
  const {
    data: bookables = [], // when data is undefined, it is assigned an empty array
    status,
    error
  } = useFetch('http://localhost:3001/bookables')

  const group = bookable?.group
  const bookablesInGroup = bookables.filter((b) => b.group === group)
  const groups = [...new Set(bookables.map((b) => b.group))]

  // useEffect(() => {
  //   getData('http://localhost:3001/bookables')
  //     .then((bookables) => {
  //       setBookable(bookables[0])
  //       setBookables(bookables)
  //       return setIsLoading(false)
  //     })
  //     .catch((error) => {
  //       setError(error)
  //       return setIsLoading(false)
  //     })
  // // [6.5] when a child component is allowed to update state, receives a setFn
  // // and if the function is used in an effect, include th
  // }, [setBookable])

  // [9.5.2] the parts not common to the custom hook go in their own effect
  //  (setBookable has no correspondent in useFetch)
  useEffect(() => {
    setBookable(bookables[0])
    // [6.5] when a child component is allowed to update state, receives a setFn
    // and if the function is used in an effect, include the function in the effect’s dependency list
  }, [bookables, setBookable])

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

  // @FeatureFlag candidate
  /** When the group changes, default the index to 0  */
  // function changeBookable(selectedBookable) {
  //   setBookable(selectedBookable)
  //   // [5.2] use the ref in a handler function
  //   // Once React has created the button element for the DOM, it assigns a reference to the element to nextButtonRef.current
  //   // We use that reference in the changeBookable function to focus the button by calling the element’s focus method
  //   // this way, whenever changeBookable is called, the focus is on Next button
  //   return nextButtonRef.current.focus()
  // }

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

  // [6.3] Check for undefined or null prop values. Return alternative UI if appropriate
  if (status === 'error') {
    return <p data-cy="error">{error.message}</p>
  }
  // @FeatureFlag candidates
  if (status === 'loading') {
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

      <ul data-cy="bookable-items" className="bookables items-list-nav">
        {bookablesInGroup.map((b, i) => (
          <li
            data-cy={`bookable-list-item-${i}`}
            key={b.id}
            className={b.id === bookable.id ? 'selected' : null}
          >
            {/* @FeatureFlag candidate */}
            {/* <button className="btn" onClick={() => changeBookable(b)}>
              {b.title}
            </button> */}

            <button className="btn" onClick={() => setBookable(b)}>
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

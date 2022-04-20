import { FaArrowRight, FaArrowLeft, FaStop } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useRef, useEffect, useCallback } from 'react'
import { useFlags } from 'launchdarkly-react-client-sdk'
import mod from '../../utils/real-modulus'
import { FLAGS } from '../../utils/flags'

// [6.2] child components destructure and use the props
export default function BookablesList({ bookable, bookables, getUrl }) {
  const group = bookable?.group
  const bookablesInGroup = bookables.filter((b) => b.group === group)
  const groups = [...new Set(bookables.map((b) => b.group))]

  // [10.2] React Router’s useNavigate returns a function we can use to set a new URL,
  // prompting the router to render whichever UI has been associated with the new path
  const navigate = useNavigate()
  const {
    [FLAGS.SLIDE_SHOW]: FF_slideShow,
    [FLAGS.PREV_NEXT]: FF_prevNextBookable
  } = useFlags()

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
  // mind that there is an order dependency between the custom hook and useEffect with unique parts
  // (setBookable has no correspondent in useFetch)
  // useEffect(() => {
  //   setBookable(bookables[0])
  // [6.5] when a child component is allowed to update state, receives a setFn
  // and if the function is used in an effect, include the function in the effect’s dependency list
  // }, [bookables, setBookable])

  function changeGroup(event) {
    const bookablesInSelectedGroup = bookables.filter(
      (b) => b.group === event.target.value
    )
    // [10.2] use the navigate function to set a new url
    /*
    To update the state, we either need a link that points to a new URL or a function that navigates to the new URL
      // JSX
      <Link to="/bookables/2">Lecture Hall</Link>

      // js
      navigate("/bookables/2");
    */

    return navigate(getUrl(bookablesInSelectedGroup[0].id))
  }

  // [6.4] why useCallback?
  // custom functions get defined on every render and can cause network spam.
  // useCallback lets us memoize functions. To prevent the redefinition or recalculation of values.
  // useCallBack(updaterFn, [dependencies])
  const nextBookable = useCallback(() => {
    const i = bookablesInGroup.indexOf(bookable)
    const nextIndex = (i + 1) % bookablesInGroup.length
    const nextBookable = bookablesInGroup[nextIndex]
    // [10.2] use the navigate function to set a new url
    return navigate(getUrl(nextBookable.id))
  }, [bookablesInGroup, bookable, getUrl, navigate])

  // [5.0] useState vs useRef
  // useState: calling the updater function triggers a re-render
  // useRef: can update a value without a corresponding change to the UI
  // use the useRef hook when you want React to manage a state value but don’t want changes to the value to trigger a re-render
  // [5.1] create a variable to hold the reference
  // useRef returns an object with a .current property
  // initially the arg passed to useRef is assigned to variable.current
  // (passing null because there is no timer initially)
  const timerRef = useRef(null)
  // [5.2] use the ref in a handler function
  // (clears the setInterval timer)
  const stopPresentation = () => clearInterval(timerRef.current)

  useEffect(() => {
    if (FF_slideShow) {
      // [5.2.2] assigning new values to the current property  of the ref object doesn’t trigger a re-render.
      // you can persist state values by assigning them to variable.current
      timerRef.current = setInterval(() => nextBookable(), 3000)

      // clean up function is called onClick, or when the component unmounts (user navigates away)
    }
    return stopPresentation
  }, [nextBookable, FF_slideShow])

  const previousBookable = useCallback(() => {
    const i = bookablesInGroup.indexOf(bookable)
    const prevIndex = mod(i - 1, bookablesInGroup.length)
    const prevBookable = bookablesInGroup[prevIndex]

    return navigate(getUrl(prevBookable.id))
  }, [bookablesInGroup, bookable, getUrl, navigate])

  return (
    <div data-cy="bookables-list">
      <select
        data-cy="bookables-list-select"
        value={group}
        onChange={changeGroup}
      >
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
            <Link to={getUrl(b.id)} className="btn" replace={true}>
              {b.title}
            </Link>
          </li>
        ))}
      </ul>
      <p>
        {FF_slideShow && (
          <button
            className="items-list-nav btn"
            data-cy="stop-btn"
            onClick={stopPresentation}
          >
            <FaStop />
            <span>Stop</span>
          </button>
        )}

        {FF_prevNextBookable?.Previous === true && (
          <button
            className="btn"
            onClick={previousBookable}
            autoFocus
            data-cy="prev-btn"
          >
            <FaArrowLeft />
            <span>Prev</span>
          </button>
        )}

        {FF_prevNextBookable?.Next === true && (
          <button
            className="btn"
            onClick={nextBookable}
            autoFocus
            data-cy="next-btn"
          >
            <FaArrowRight />
            <span>Next</span>
          </button>
        )}
      </p>
    </div>
  )
}

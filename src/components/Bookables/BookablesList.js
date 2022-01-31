import { bookables, sessions, days } from '../../static.json'
import { useState } from 'react'
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'

// CH2 complete

/* [2.0] Why useState?
 We want to alert React that a value used within a component has changed
 so it can rerun the component and update the UI.
 Just updating the variable directly won’t do.
 We need a way of changing that value, some kind of updater function,
 that triggers React to call the component with the new value and get the updated UI
*/
export default function BookablesList() {
  // [2.1] calling useState returns a value and its updater function in an array of 2, the names are arbitrary
  // if you want an initial value for the variable, pass it as an argument to the useState
  /// note: the useState hook also accepts a function as its argument, a lazy initial state
  /// Use the lazy initial state if you need to undertake expensive work to generate an initial value
  const [group, setGroup] = useState('Rooms')

  /** uses a set to ignore the duplicates, converts to an array with [... ] */
  const groups = [...new Set(bookables.map((b) => b.group))]

  /** filter by group, Rooms or Kit */
  const bookablesInGroup = bookables.filter((b) => b.group === group)

  /* could do this too... but no
    const bookableIndexArray = useState();
    const bookableIndex = bookableIndexArray[0];
    const setIndex = bookableIndexArray[1];
  */
  const [bookableIndex, setIndex] = useState(0)

  const bookable = bookablesInGroup[bookableIndex]

  // [2.2] Updater function: when we want to update a state value based on a previous value, we can pass it a fn
  // React passes that fn to the current state value, and uses the return value as the new state Value
  // setSomething(oldValue => newValue)
  const [hasDetails, setHasDetails] = useState(false)

  /** event handler for the next button */
  const selectNext = () => setIndex((i) => (i + 1) % bookablesInGroup.length)

  /** need real modulus for negative numbers */
  const mod = (n, m) => ((n % m) + m) % m

  const selectPrevious = () =>
    setIndex((i) => mod(i - 1, bookablesInGroup.length))

  return (
    <>
      <div>
        <select value={group} onChange={(e) => setGroup(e.target.value)}>
          {groups.map((g) => (
            <option value={g} key={g}>
              {g}
            </option>
          ))}
        </select>
        <ul className="bookables items-list-nav" data-cy="bookables-list">
          {bookablesInGroup.map((b, i) => (
            <li key={b.id} className={i === bookableIndex ? 'selected' : null}>
              <button className="btn" onClick={() => setIndex(i)}>
                {b.title}
              </button>
            </li>
          ))}
        </ul>
        <p>
          <button
            className="btn"
            onClick={selectPrevious}
            autoFocus
            data-cy="prev-btn"
          >
            <FaArrowLeft /> <span>Previous</span>
          </button>
          <button
            className="btn"
            onClick={selectNext}
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
                    onChange={() => setHasDetails((has) => !has)}
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

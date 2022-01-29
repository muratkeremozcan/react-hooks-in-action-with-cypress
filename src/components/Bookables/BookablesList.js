import { bookables } from '../../static.json'
import { useState } from 'react'
import { FaArrowRight } from 'react-icons/fa'

/* [2.0] Why useState?
 We want to alert React that a value used within a component has changed
 so it can rerun the component and update the UI.
 Just updating the variable directly won’t do.
 We need a way of changing that value, some kind of updater function,
 that triggers React to call the component with the new value and get the updated UI
*/
export default function BookablesList() {
  const [group, setGroup] = useState('Rooms')
  // uses a set to ignore the duplicates, converts to an array with [... ]
  const groups = [...new Set(bookables.map((b) => b.group))]

  console.log(new Set(bookables.map((b) => b.group)))

  const bookablesInGroup = bookables.filter((b) => b.group === group)
  // [2.1] calling useState returns a value and its updater function in an array of 2, the names are arbitrary
  // if you want an initial value for the variable, pass it as an argument to the useState
  // [2.2] the useState hook also accepts a function as its argument, a lazy initial state
  // Use the lazy initial state if you need to undertake expensive work to generate an initial value
  const [bookableIndex, setBookableIndex] = useState(0)
  /* could do this too... but no
    const bookableIndexArray = useState();
    const bookableIndex = bookableIndexArray[0];
    const setBookableIndex = bookableIndexArray[1];
  */

  // [2.3] Updater function: when we want to update a state value based on a previous value, we can pass it a fn
  // React passes that fn to the current state value, and uses the return value as the new state Value
  // setSomething(oldValue => newValue)
  /** event handler for the next button */
  const nextBookable = () =>
    setBookableIndex((i) => (i + 1) % bookablesInGroup.length)

  return (
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
            <button className="btn" onClick={() => setBookableIndex(i)}>
              {b.title}
            </button>
          </li>
        ))}
      </ul>
      <p>
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
  )
}

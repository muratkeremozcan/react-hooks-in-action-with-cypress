import { useState } from 'react'
import { Link } from 'react-router-dom'
import { days, sessions } from '../../static.json'
import { FaEdit } from 'react-icons/fa'

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

*/

export default function BookableDetails({ bookable }) {
  // [2.1] useState hook: returns a value & its updater function in an array of 2, the names are arbitrary
  // if you want an initial value for the variable, pass it as an argument to the useState
  // const [value, setValue] = useState(initialValue);
  /*
  note: [2.2] lazy load: the useState hook also accepts a function as its argument, a lazy initial state
  Use the lazy initial state if you need to undertake expensive work to generate an initial value
  Example at [4.1] , or search for (2.1) reference
  const [value, setValue] = useState(() => {
    return initialState
  })

  instead of destructuring, could do this too... but no
  const bookableIndexArray = useState()
  const bookableIndex = bookableIndexArray[0]
  const setBookableIndex = bookableIndexArray[1] */
  const [hasDetails, setHasDetails] = useState(true)

  // [2.3] Updater function: setValue(previousValue => newValue)
  // when we want to update a state value based on a previous value, we can pass it a fn
  // React passes that fn to the current state value, and uses the return value as the new state Value
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

  function toggleDetails() {
    setHasDetails((has) => !has)
  }

  return bookable ? (
    <div data-cy="bookable-details" className="bookable-details item">
      <div className="item-header">
        <h2>{bookable.title}</h2>
        <span className="controls">
          <label>
            <input
              type="checkbox"
              onChange={toggleDetails}
              checked={hasDetails}
            />
            Show Details
          </label>

          <Link
            to={`/bookables/${bookable.id}/edit`}
            replace={true}
            className="btn btn-header"
            data-cy="edit-bookable"
          >
            <FaEdit />
            <span>Edit</span>
          </Link>
        </span>
      </div>

      <p>{bookable.notes}</p>

      {hasDetails && (
        <div className="item-details">
          <h3>Availability</h3>
          <div className="bookable-availability">
            <ul>
              {bookable.days?.sort().map((d) => (
                <li key={d}>{days[d]}</li>
              ))}
            </ul>
            <ul>
              {bookable.sessions?.map((s) => (
                <li key={s}>{sessions[s]}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  ) : null
  // [6.3] Check for undefined or null prop values. Return alternative UI if appropriate
}

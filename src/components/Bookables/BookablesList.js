import { bookables } from '../../static.json'
import { useState } from 'react'

/* [2.0] Why useState?
 We want to alert React that a value used within a component has changed
 so it can rerun the component and update the UI.
 Just updating the variable directly won’t do.
 We need a way of changing that value, some kind of updater function,
 that triggers React to call the component with the new value and get the updated UI
*/
export default function BookablesList() {
  const group = 'Rooms'
  const bookablesInGroup = bookables.filter((b) => b.group === group)
  // [2.1] calling useState returns a value and its updater function in an array of 2, the names are arbitrary
  // if you want an initial value for the variable, pass it as an argument to the useState
  const [bookableIndex, setBookableIndex] = useState(0)
  /* could do this too... but no
    const bookableIndexArray = useState();
    const bookableIndex = bookableIndexArray[0];
    const setBookableIndex = bookableIndexArray[1];
  */

  return (
    <ul className="bookables items-list-nav" data-cy="bookables-list">
      {bookablesInGroup.map((b, i) => (
        <li key={b.id} className={i === bookableIndex ? 'selected' : null}>
          <button className="btn" onClick={() => setBookableIndex(i)}>
            {b.title}
          </button>
        </li>
      ))}
    </ul>
  )
}

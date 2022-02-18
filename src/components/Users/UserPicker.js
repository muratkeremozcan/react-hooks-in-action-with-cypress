import { useEffect, useState, useContext } from 'react'
import Spinner from '../UI/Spinner'
import UserContext from './UserContext'

// [4.4] useEffect with fetch
export default function UserPicker() {
  // [4.4.1] when initializing state, use null for conditional rendering
  const [users, setUsers] = useState(null)

  // [8.6] showcase of using context api vs passing props to children
  // previously the component had to take in props from its parent (App.js) UserPicker({ user, setUser })
  const { user, setUser } = useContext(UserContext)

  // [4.4.2] useEffect to fetch data, once with [],
  // if not once, it will keep fetching data forever
  useEffect(
    () =>
      fetch('http://localhost:3001/users')
        .then((resp) => resp.json())
        .then((data) => {
          setUsers(data)
          return setUser(data[0])
        }),
    // [6.5] when a child component is allowed to update state, receives a setFn
    // and if the function is used in an effect, include the function in the effect’s dependency list
    [setUser]
  )

  function handleSelect(e) {
    const selectedID = parseInt(e.target.value, 10)
    const selectedUser = users.find((u) => u.id === selectedID)

    return setUser(selectedUser)
  }

  // [6.3] Check for undefined or null prop values. Return alternative UI if appropriate
  return users === null ? (
    <Spinner />
  ) : (
    <select className="user-picker" value={user?.id} onChange={handleSelect}>
      {users.map((u) => (
        <option key={u.id} value={u.id}>
          {u.name}
        </option>
      ))}
    </select>
  )
}

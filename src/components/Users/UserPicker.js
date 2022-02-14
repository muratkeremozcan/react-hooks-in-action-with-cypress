import { useEffect, useState } from 'react'
import Spinner from '../UI/Spinner'

// [4.4] useEffect with fetch
export default function UserPicker() {
  // [4.4.1] when initializing state, use null for conditional rendering
  const [users, setUsers] = useState(null)

  // [4.4.2] useEffect to fetch data, once with [],
  // if not once, it will keep fetching data forever
  useEffect(
    () =>
      fetch('http://localhost:3001/users')
        .then((resp) => resp.json())
        .then((data) => setUsers(data)),
    []
  )

  // [6.3] Check for undefined or null prop values. Return alternative UI if appropriate
  return users === null ? (
    <Spinner />
  ) : (
    <select>
      {users.map((u) => (
        <option key={u.id}>{u.name}</option>
      ))}
    </select>
  )
}

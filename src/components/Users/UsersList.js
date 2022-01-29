import { users } from '../../static.json'
import { useState } from 'react'

export default function UsersList() {
  const [userIndex, setUserIndex] = useState(0)

  return (
    <ul className="users items-list-nav" data-cy="users-list">
      {users.map((u, i) => (
        <li key={u.id} className={i === userIndex ? 'selected' : null}>
          <button className="btn" onClick={() => setUserIndex(i)}>
            {!u.name}
          </button>
        </li>
      ))}
    </ul>
  )
}

import { useState } from 'react'
import UsersList from './UsersList'
import UserDetails from './UserDetails'

export default function UsersPage() {
  const [user, setUser] = useState(null)

  // [6.0] when components use the same data to build their UI,
  // share that data by passing it as a prop from parent to child
  return (
    <main data-cy="users-page" className="users-page">
      <UsersList setUser={setUser} />
      <UserDetails user={user} />
    </main>
  )
}

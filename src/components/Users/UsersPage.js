import UsersList from './UsersList'
import UserDetails from './UserDetails'
// [8.4] in any component that is consuming Context API, import the context object and useContext hook
import { useState } from 'react'
import { useUser } from './UserContext' // import custom hook

export default function UsersPage() {
  const [user, setUser] = useState(null)

  // [8.5] call useContext with the shared context, assign to a var
  // (get the user from context)
  // const loggedInUser = useContext(UserContext)
  // [9.5] destructure as needed; use custom hook instead of the above
  const [loggedInUser] = useUser()
  // [9.5.1] note: before hooks, presentational components would leave any business logic to wrapper components
  // with hooks, the business logic can be more easily encapsulated, reused, and shared.

  // if no user has been selected in the users list, select the logged in user
  const currentUser = user || loggedInUser

  // [6.0] parent & children sharing state
  // when components use the same data to build their UI,
  // share that data by passing it as a prop from parent to child
  return (
    <main data-cy="users-page" className="users-page">
      {/* [6.1] if a child needs to have and/or update state, pass state and/or the updater function to it */}
      <UsersList user={currentUser} setUser={setUser} />
      <UserDetails user={currentUser} />
    </main>
  )
}

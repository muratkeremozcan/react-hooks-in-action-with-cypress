import UsersList from './UsersList'
import UserDetails from './UserDetails'
// [8.4] in any component that is consuming Context API, import the context object and useContext hook
import UserContext from './UserContext'
import { useState, useContext } from 'react'

export default function UsersPage() {
  const [user, setUser] = useState(null)

  // [8.5] call useContext with the shared context, assign to a var
  // (get the user from context)
  // since the value prop is an object when passing multiple values, we destructure it
  // the colon syntax lets us assign a property to a differently named variable
  const { user: loggedInUser } = useContext(UserContext)
  // single value comparison
  // const loggedInUser = useContext(UserContext)

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

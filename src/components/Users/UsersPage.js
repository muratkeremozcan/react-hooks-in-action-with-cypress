import { useState, Suspense } from 'react'
import UsersList from './UsersList'
import { useUser } from './UserContext'
import PageSpinner from '../UI/PageSpinner'
import UserDetails from './UserDetails'
import { useQueryClient } from 'react-query'
import getData from '../../utils/api'

export default function UsersPage() {
  // [8.5] call useContext with the shared context, assign to a var
  // (get the user from context)
  // const loggedInUser = useContext(UserContext)
  // [9.4.1] destructure as needed; use custom hook instead of the above
  const [loggedInUser] = useUser()
  const [selectedUser, setSelectedUser] = useState(null)

  // [9.5.1] note: before hooks, presentational components would leave any business logic to wrapper components
  // with hooks, the business logic can be more easily encapsulated, reused, and shared.

  // if no user has been selected in the users list, select the logged in user
  const user = selectedUser || loggedInUser

  // [12.3] too specific into React Query's Suspense integration, image loading, and pre-fetching images
  const queryClient = useQueryClient()

  function switchUser(nextUser) {
    setSelectedUser(nextUser)

    queryClient.prefetchQuery(['user', nextUser.id], () =>
      getData(`http://localhost:3001/users/${nextUser.id}`)
    )

    // doing the same thing at Avatar.js
    queryClient.prefetchQuery(
      `http://localhost:3001/img/${nextUser.img}`,
      () =>
        new Promise((resolve) => {
          const img = new Image()
          img.onload = () => resolve(img)
          img.src = `http://localhost:3001/img/${nextUser.img}`
        })
    )
  }

  // [6.0] parent & children sharing state
  // when components use the same data to build their UI,
  // share that data by passing it as a prop from parent to child
  return user ? (
    <main className="users-page">
      {/* [6.1] if a child needs to have and/or update state, pass state and/or the updater function to it */}
      <UsersList user={user} setUser={switchUser} />

      <Suspense fallback={<PageSpinner />}>
        <UserDetails userID={user.id} />
      </Suspense>
    </main>
  ) : (
    <PageSpinner />
  )
}

import { useState } from 'react'
import { useQuery } from 'react-query'
import { useFlags } from 'launchdarkly-react-client-sdk'
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'
// import Spinner from '../UI/Spinner'  // (12.2) use Suspense and ErrorBoundary instead
import getData from '../../utils/api'
import mod from '../../utils/real-modulus'
import { FLAGS } from '../../utils/flags'

export default function UsersList({ user, setUser }) {
  // [4.4] useEffect with fetch
  // [4.4.1] when initializing state, use null for conditional rendering
  // const [error, setError] = useState(null)
  // const [isLoading, setIsLoading] = useState(true)
  // const [users, setUsers] = useState(null)
  // [9.5.1] using the custom hook, we can simplify the state
  // const {
  //   data: users = [],
  //   status,
  //   error
  // } = useFetch('http://localhost:3001/users')

  // [10.4.2] useQuery with a string as the query key
  // const { data, status, error } = useQuery(key, () => fetch(url))
  const {
    data: users = []
    // status,
    // error // (12.2) use Suspense and ErrorBoundary instead
  } = useQuery('users', () => getData('http://localhost:3001/users'), {
    suspense: true
  })

  const [userIndex, setUserIndex] = useState(() => user.id - 1)
  const { [FLAGS.PREV_NEXT_USER]: FF_nextPrev } = useFlags()

  // [4.4.2] useEffect to fetch data, once with [],
  // if not once, it will keep fetching data forever
  // useEffect(
  //   () =>
  //     fetch('http://localhost:3001/users')
  //       .then((resp) => resp.json())
  //       .then((data) => setUsers(data)),
  //   []
  // )

  // [4.5] using async await
  // useEffect callbacks are synchronous to prevent race conditions.
  // if you want to use async await, it has to be wrapped inside and invoked
  // useEffect(() => {
  //   ;(async () => {
  //     const resp = await fetch('http://localhost:3001/users')
  //     const data = await resp.json()
  //     return setUsers(data)
  //   })()
  // }, [])

  // [4.4.1] useEffect to fetch data
  // useEffect(
  //   () =>
  //     getData('http://localhost:3001/users')
  //       .then((data) => {
  //         // don't set user here - it's done in UsersPage
  //         // setUser(data[0])
  //         // setUserIndex(0)
  //         setUsers(data)
  //         return setIsLoading(false)
  //       })
  //       .catch((err) => {
  //         setError(err)
  //         return setIsLoading(false)
  //       }),
  //   // [6.5] when a child component is allowed to update state, receives a setFn
  //   // and if the function is used in an effect, include the function in the effect’s dependency list
  //   [setUser]
  // )

  const selectNext = () => {
    setUserIndex((userIndex) => mod(userIndex + 1, users.length))
    return setUser(users[mod(userIndex + 1, users.length)])
  }

  const selectPrevious = () => {
    setUserIndex((userIndex) => mod(userIndex - 1, users.length))
    return setUser(users[mod(userIndex - 1, users.length)])
  }

  // (12.2) use Suspense and ErrorBoundary instead
  // if (status === 'error') {
  //   return <p data-cy="error">{error.message}</p>
  // }
  // if (status === 'loading') {
  //   return (
  //     <p>
  //       <Spinner /> Loading bookables...
  //     </p>
  //   )
  // }

  return (
    <div>
      <ul className="users items-list-nav" data-cy="users-list">
        {users.map((u, i) => (
          <li
            data-cy={`users-list-item-${i}`}
            key={u.id}
            className={u.id === user?.id ? 'selected' : null}
          >
            <button className="btn" onClick={() => setUser(u)}>
              {u.name}
            </button>
          </li>
        ))}
      </ul>
      <p>
        {(FF_nextPrev === 2 || FF_nextPrev === 3) && (
          <button
            className="btn"
            onClick={selectPrevious}
            autoFocus
            data-cy="prev-btn"
          >
            <FaArrowLeft /> <span>Previous</span>
          </button>
        )}

        {(FF_nextPrev === 1 || FF_nextPrev === 3) && (
          <button
            className="btn"
            onClick={selectNext}
            autoFocus
            data-cy="next-btn"
          >
            <FaArrowRight /> <span>Next</span>
          </button>
        )}
      </p>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'
import Spinner from '../UI/Spinner'
import getData from '../../utils/api'

export default function UsersList() {
  // [4.4] useEffect with fetch (example 2)
  // [4.4.1] when initializing state, use null for conditional rendering
  const [users, setUsers] = useState(null)
  const [userIndex, setIndex] = useState(0)
  const user = users?.[userIndex]

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
  // personally I think it is horrible...
  // useEffect(() => {
  //   ;(async () => {
  //     const resp = await fetch('http://localhost:3001/users')
  //     const data = await resp.json()
  //     return setUsers(data)
  //   })()
  // }, [])

  // challenge ch 4 ending: use the getData helper function
  useEffect(
    () => getData('http://localhost:3001/users').then((data) => setUsers(data)),
    []
  )

  const selectNext = () => setIndex((i) => (i + 1) % users.length)

  /** need real modulus for negative numbers */
  const mod = (n, m) => ((n % m) + m) % m

  const selectPrevious = () => setIndex((i) => mod(i - 1, users.length))

  return users === null ? (
    <p>
      <Spinner /> Loading users...
    </p>
  ) : (
    <>
      <ul className="users items-list-nav" data-cy="users-list">
        {users.map((u, i) => (
          <li key={u.id} className={i === userIndex ? 'selected' : null}>
            <button className="btn" onClick={() => setIndex(i)}>
              {u.name}
            </button>
          </li>
        ))}
      </ul>
      <p>
        <button
          className="btn"
          onClick={selectPrevious}
          autoFocus
          data-cy="prev-btn"
        >
          <FaArrowLeft /> <span>Previous</span>
        </button>
        <button
          className="btn"
          onClick={selectNext}
          autoFocus
          data-cy="next-btn"
        >
          <FaArrowRight /> <span>Next</span>
        </button>
      </p>
      {user && (
        <div className="item user">
          <div className="item-header">
            <h2>{user.name}</h2>
          </div>
          <div className="user-details">
            <h3>{user.title}</h3>
            <p>{user.notes}</p>
          </div>
        </div>
      )}
    </>
  )
}

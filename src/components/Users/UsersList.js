import { useEffect, useState } from 'react'
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'
import Spinner from '../UI/Spinner'
import getData from '../../utils/api'
import mod from '../../utils/real-modulus'

export default function UsersList({ setUser }) {
  // [4.4] useEffect with fetch (example 2)
  // [4.4.1] when initializing state, use null for conditional rendering
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState(null)
  const [userIndex, setUserIndex] = useState(0)

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
  useEffect(
    () =>
      // todo: add note from summary
      getData('http://localhost:3001/users')
        .then((data) => {
          // set initial user to first (or undefined)
          setUser(data[0])
          setUserIndex(0)
          setUsers(data)
          return setIsLoading(false)
        })
        .catch((err) => {
          setError(err)
          return setIsLoading(false)
        }),
    [setUser]
  )

  // @Feature-flag candidates
  const selectNext = () => {
    setUserIndex((userIndex) => mod(userIndex + 1, users.length))
    return setUser(users[userIndex])
  }
  const selectPrevious = () => {
    setUserIndex((userIndex) => mod(userIndex - 1, users.length))
    return setUser(users[userIndex])
  }

  if (error) {
    return <p data-cy="error">{error.message}</p>
  }

  if (isLoading) {
    return (
      <p data-cy="spinner">
        <Spinner /> Loading users...
      </p>
    )
  }

  return (
    <>
      <ul className="users items-list-nav" data-cy="users-list">
        {users.map((u, i) => (
          <li
            data-cy={`users-list-item-${i}`}
            key={i}
            className={i === userIndex ? 'selected' : null}
          >
            <button
              className="btn"
              onClick={() => {
                setUser(u)
                return setUserIndex(i)
              }}
            >
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
    </>
  )
}

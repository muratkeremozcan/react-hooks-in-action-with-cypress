import { users } from '../../static.json'
import { useState } from 'react'
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'

export default function UsersList() {
  const [userIndex, setIndex] = useState(0)

  // data starts at 1
  const user = users[userIndex + 1]

  const selectNext = () => setIndex((i) => (i + 1) % users.length)

  /** need real modulus for negative numbers */
  const mod = (n, m) => ((n % m) + m) % m

  const selectPrevious = () => setIndex((i) => mod(i - 1, users.length))

  return (
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

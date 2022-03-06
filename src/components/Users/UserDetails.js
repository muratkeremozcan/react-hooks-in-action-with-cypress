import { useQuery } from 'react-query'
import getData from '../../utils/api'
import Avatar from './Avatar'

// [6.2] child components destructure and use the props
export default function UserDetails({ userID }) {
  // [12.2] use Suspense & ErrorBoundary (while loading images)
  // remember the 3 way results from (12.0) while loading show the Suspense, if success show the component, if error show the ErrorBoundary
  // this one goes too specific into utilizing React Query’s Suspense integration
  const { data: user } = useQuery(
    ['user', userID],
    () => getData(`http://localhost:3001/users/${userID}`),
    { suspense: true }
  )

  return (
    <div data-cy="user-details" className="item user">
      <div className="item-header">
        <h2>{user.name}</h2>
      </div>

      <Avatar
        src={`http://localhost:3001/img/${user.img}`}
        fallbackSrc="http://localhost:3001/img/avatar.gif"
        alt={user.name}
      />

      <div className="user-details">
        <h3>{user.title}</h3>
        <p>{user.notes}</p>
      </div>
    </div>
  )
}

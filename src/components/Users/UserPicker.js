import { useEffect } from 'react'
import { useQuery } from 'react-query'
import getData from '../../utils/api'
import Spinner from '../UI/Spinner'

// [4.4] useEffect with fetch
export default function UserPicker({ user, setUser }) {
  // [4.4.1] when initializing state, use null for conditional rendering
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
    data: users = [],
    status,
    error
  } = useQuery('users', () => getData('http://localhost:3001/users'))

  // [4.4.2] useEffect to fetch data, once with [],
  // if not once, it will keep fetching data forever
  // useEffect(
  //   () =>
  //     fetch('http://localhost:3001/users')
  //       .then((resp) => resp.json())
  //       .then((data) => {
  //         setUsers(data)
  //         return setUser(data[0])
  //       }),
  //   // [6.5] when a child component is allowed to update state, receives a setFn
  //   // and if the function is used in an effect, include the function in the effect’s dependency list
  //   [setUser]
  // )
  // [9.5.2] the parts not common to the custom hook go in their own effect
  // mind that there is an order dependency between the custom hook and useEffect with unique parts
  // (setUser has no correspondent in useEffect)
  useEffect(() => {
    setUser(users[0])
  }, [users, setUser])
  // [9.6] other notes about hooks:
  // Don’t put hooks inside conditionals.
  // Don’t put hooks inside loops.
  // Don’t put hooks inside nested functions.
  // Don’t call hooks from regular JavaScript functions; keep your hook calls within function components and custom hooks.
  // If you need side-effect code to run only under certain conditions, put the condition check inside the effect:
  /*
    useEffect(() => {
      if (condition) {
        // perform task.
      }
    }, [dep1, dep2]);
  */

  function handleSelect(e) {
    const selectedID = parseInt(e.target.value, 10)
    const selectedUser = users.find((u) => u.id === selectedID)

    return setUser(selectedUser)
  }

  // [6.3] Check for undefined or null prop values. Return alternative UI if appropriate
  if (status === 'error') {
    return <p data-cy="error">{error.message}</p>
  }

  if (status === 'loading') {
    return <Spinner />
  }

  return (
    <select className="user-picker" value={user?.id} onChange={handleSelect}>
      {users.map((u) => (
        <option key={u.id} value={u.id}>
          {u.name}
        </option>
      ))}
    </select>
  )
}

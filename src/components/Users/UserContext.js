// [8.0] Context api lets us pass a value deep into the component tree
// without explicitly threading it through every component (2nd tier state management)
// Create a context for the current theme (with "light" as the default).

import { createContext, useContext } from 'react'

const UserContext = createContext()

export default UserContext

const UserSetContext = createContext()

// [9.4] identify what components may need in common
// Manage state and effects related to a hook’s functionality within the hook and return only the value(s) that components need
export function useUser() {
  const user = useContext(UserContext)
  const setUser = useContext(UserSetContext)

  return [user, setUser]
}

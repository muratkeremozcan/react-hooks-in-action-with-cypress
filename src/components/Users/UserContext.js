// [8.0] Context api lets us pass a value deep into the component tree
// without explicitly threading it through every component.
// Create a context for the current theme (with "light" as the default).

import { createContext } from 'react'

const UserContext = createContext()

export default UserContext

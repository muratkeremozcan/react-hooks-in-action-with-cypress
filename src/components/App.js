import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

import '../App.css'

import { FaCalendarAlt, FaDoorOpen, FaUsers } from 'react-icons/fa'

import BookablesPage from './Bookables/BookablesPage'
import BookingsPage from './Bookings/BookingsPage'
import UsersPage from './Users/UsersPage'
import UserPicker from './Users/UserPicker'

// [8.1] import the context object
import UserContext from './Users/UserContext'

export default function App() {
  // [8.2] identify the state to be passed down
  const [user, setUser] = useState()

  // [8.3] wrap the UI with the context’s Provider component, using the state as a prop

  return (
    <UserContext.Provider value={user}>
      <Router>
        <div className="App">
          <header>
            <nav>
              <ul>
                <li>
                  <Link to="/bookings" className="btn btn-header">
                    <FaCalendarAlt />
                    <span>Bookings</span>
                  </Link>
                </li>
                <li>
                  <Link to="/bookables" className="btn btn-header">
                    <FaDoorOpen />
                    <span>Bookables</span>
                  </Link>
                </li>
                <li>
                  <Link to="/users" className="btn btn-header">
                    <FaUsers />
                    <span>Users</span>
                  </Link>
                </li>
              </ul>
            </nav>

            <UserPicker user={user} setUser={setUser} />
          </header>

          {/*  // https://reactrouter.com/docs/en/v6/getting-started/overview */}
          <Routes>
            <Route path="/bookings" element={<BookingsPage />} />
            {/* ch[10.0] using path attributes for Route components to extract state values
            enable nested routes with /*  */}
            <Route path="/bookables/*" element={<BookablesPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Routes>
        </div>
      </Router>
    </UserContext.Provider>
  )
}

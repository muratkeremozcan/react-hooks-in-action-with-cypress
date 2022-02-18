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

  // [8.3] wrap the UI with the context object's Provider component
  // its the value prop makes the state available to descendant components
  // we can put multiple context objects in value prop
  return (
    // single value comparison
    // <UserContext.Provider value={user}>
    <UserContext.Provider value={{ user, setUser }}>
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

            <UserPicker />
          </header>

          <Routes>
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/bookables" element={<BookablesPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Routes>
        </div>
      </Router>
    </UserContext.Provider>
  )
}

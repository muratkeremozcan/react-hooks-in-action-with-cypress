import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

import '../App.css'

import { FaCalendarAlt, FaDoorOpen, FaUsers } from 'react-icons/fa'

import BookablesPage from './Bookables/BookablesPage'
import BookingsPage from './Bookings/BookingsPage'
import UsersPage from './Users/UsersPage'
import UserPicker from './Users/UserPicker'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/bookings" element={BookingsPage} />
        <Route path="/bookables" element={BookablesPage} />
        <Route path="/users" element={UsersPage} />
      </Routes>
    </Router>
  )
}

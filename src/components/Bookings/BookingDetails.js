// [8.4] in any component that is consuming Context API, import the context object and useContext hook
// import UserContext from '../Users/UserContext'
// import { useContext } from 'react'
// [9.5] use custom hook instead
import { useUser } from '../Users/UserContext'
import Booking from './Booking'
import { FaEdit } from 'react-icons/fa'

export default function BookingDetails({ booking, bookable }) {
  // [8.5] call useContext with the shared context, assign to a var
  // const user = useContext(UserContext)
  // [9.4.1] destructure as needed; use custom hook instead of the above
  const [user] = useUser()

  const isBooker = booking && user && booking.bookerId === user.id

  return (
    <div data-cy="booking-details" className="booking-details">
      <h2>Booking Details</h2>
      {isBooker && (
        <span data-cy="booking-controls" className="controls">
          <button className="btn">
            <FaEdit />
          </button>
        </span>
      )}

      {booking ? (
        <Booking booking={booking} bookable={bookable}></Booking>
      ) : (
        <div data-cy="booking-message" className="booking-details-fields">
          <p>Select a booking or a booking slot</p>
        </div>
      )}
    </div>
  )
}

// [8.4] in any component that is consuming Context API, import the context object and useContext hook
// import UserContext from '../Users/UserContext'
// import { useContext } from 'react'
// [9.5] use custom hook instead
import { useUser } from '../Users/UserContext'
import {
  useBookingsParams,
  useCreateBooking,
  useDeleteBooking,
  useUpdateBooking
} from './bookingsHooks'
import { useEffect, useState } from 'react'
import { FaEdit } from 'react-icons/fa'
import { getWeek, shortISO } from '../../utils/date-wrangler'

import Booking from './Booking'
import BookingForm from './BookingForm'

export default function BookingDetails({ booking, bookable }) {
  // ch10 challenge
  const [isEditing, setIsEditing] = useState(true)
  const { date } = useBookingsParams()
  const week = getWeek(date)
  const key = [
    'bookings',
    bookable.id,
    shortISO(week.start),
    shortISO(week.end)
  ]

  // [8.5] call useContext with the shared context, assign to a var
  // const user = useContext(UserContext)
  // [9.4.1] destructure as needed; use custom hook instead of the above
  const [user] = useUser()
  const isBooker = booking && user && booking.bookerId === user.id

  const { createBooking, isCreating } = useCreateBooking(key)
  const { updateBooking, isUpdating } = useUpdateBooking(key)
  const { deleteBooking, isDeleting } = useDeleteBooking(key)

  useEffect(() => {
    setIsEditing(booking && booking.id === undefined)
  }, [booking])

  function handleSave(item) {
    setIsEditing(false)
    if (item.id === undefined) {
      createBooking({ ...item, bookerId: user.id })
    } else {
      updateBooking(item)
    }
  }

  function handleDelete(item) {
    if (window.confirm('Are you sure you want to delete the booking?')) {
      setIsEditing(false)
      deleteBooking(item.id)
    }
  }

  return (
    <div data-cy="booking-details" className="booking-details">
      <h2>
        Booking Details
        {isBooker && (
          <span data-cy="booking-controls" className="controls">
            <button className="btn" onClick={() => setIsEditing((v) => !v)}>
              <FaEdit />
              <span>Edit</span>
            </button>
          </span>
        )}
      </h2>

      {isCreating || isUpdating || isDeleting ? (
        <div className="booking-details-fields">
          <p>Saving...</p>
        </div>
      ) : isEditing ? (
        <BookingForm
          booking={booking}
          bookable={bookable}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      ) : booking ? (
        <Booking booking={booking} bookable={bookable}></Booking>
      ) : (
        <div data-cy="booking-message" className="booking-details-fields">
          <p>Select a booking or a booking slot</p>
        </div>
      )}
    </div>
  )
}

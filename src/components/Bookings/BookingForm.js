import { FaTrash, FaCloudUploadAlt } from 'react-icons/fa'
import useFormState from '../Bookables/useFormState'

export default function BookingForm({ booking, bookable, onSave, onDelete }) {
  const { state, handleChange } = useFormState(booking)
  const isNew = booking?.id === undefined
  const btnText = isNew ? 'Add Booking' : 'Update'

  return booking ? (
    <>
      <div data-cy="booking-form" className="booking-details-fields item-form">
        <label>Title</label>
        <p>
          <input
            type="text"
            name="title"
            value={state.title}
            onChange={handleChange}
          ></input>
        </p>

        <label>Bookable</label>
        <p>{bookable.title}</p>

        <label>Booking Date</label>
        <p>{new Date(booking.date).toLocaleDateString()}</p>

        <label>Notes</label>
        <p>
          <textarea
            name="notes"
            rows={6}
            cols={30}
            value={booking.notes}
            onChange={handleChange}
            data-cy="notes"
          />
        </p>
      </div>

      <p className="controls">
        {!isNew && (
          <button
            data-cy="btn-delete"
            className="btn btn-delete"
            onClick={() => onDelete(booking)}
          >
            <FaTrash />
            <span>Delete</span>
          </button>
        )}

        <button
          data-cy="btn-dual"
          className="btn"
          onClick={() => onSave(state)}
        >
          <FaCloudUploadAlt />
          <span>{btnText}</span>
        </button>
      </p>
    </>
  ) : null
}

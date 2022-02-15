export default function BookingsGrid(props) {
  const { week, bookable, booking, setBooking } = props

  return (
    <div data-cy="bookings-grid" className="bookings-grid placeholder">
      <h3>Bookings Grid</h3>
      <>{bookable?.title}</>
      <p>{week.date.toISOString()}</p>
    </div>
  )
}

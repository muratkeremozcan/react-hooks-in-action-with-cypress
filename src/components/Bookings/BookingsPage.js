import { useState } from 'react'
import BookablesList from '../Bookables/BookablesList'
import Bookings from './Bookings'

export default function BookablesPage() {
  const [bookable, setBookable] = useState(null)

  return (
    <main className="bookings-page">
      <BookablesList bookable={bookable} setBookable={setBookable} />
      <Bookings bookable={bookable} />
    </main>
  )
}

import { shortISO } from '../../utils/date-wrangler'
import { useBookingsParams } from './bookingsHooks'

import { useQuery } from 'react-query'
import getData from '../../utils/api'

import BookablesList from '../Bookables/BookablesList'
import Bookings from './Bookings'

// [10.4.2] useQuery with a string as the query key
// const { data, status, error } = useQuery(key, () => fetch(url))

export default function BookablesPage() {
  const {
    data: bookables = []
    //   status,
    //   error // (12.2) use Suspense & ErrorBoundary instead
  } = useQuery('bookables', () => getData('http://localhost:3001/bookables'), {
    suspense: true
  })

  // [10.3.3] access the query string's search params
  const { date, bookableId } = useBookingsParams()

  // if invalid url, set it as the first bookable
  const bookable = bookables.find((b) => b.id === bookableId) || bookables[0]

  // if no date, just show the bookable, otherwise show the whole query string with both search params
  function getUrl(id) {
    const root = `/bookings?bookableId=${id}`
    return date ? `${root}&date=${shortISO(date)}` : root
  }

  // (12.2) use Suspense and ErrorBoundary instead; the parent component App has them
  // if (status === 'error') {
  //   return <p>{error.message}</p>
  // }

  // if (status === 'loading') {
  //   return <PageSpinner />
  // }

  return (
    <main className="bookings-page">
      <BookablesList
        bookable={bookable}
        bookables={bookables}
        getUrl={getUrl}
      />
      <Bookings bookable={bookable} />
    </main>
  )
}

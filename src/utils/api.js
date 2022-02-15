import { shortISO } from './date-wrangler'

/** Sends a get request, checks the response for errors, converts the response to a js object */
export default function getData(url) {
  return fetch(url).then((resp) => {
    if (!resp.ok) {
      throw Error('There was a problem fetching data.')
    }

    return resp.json()
  })
}

export function getBookings(bookableId, startDate, endDate) {
  const start = shortISO(startDate)
  const end = shortISO(endDate)

  const urlRoot = 'http://localhost:3001/bookings'

  const query = `bookableId=${bookableId} &date_gte=${start}&date_lte=${end}`

  return getData(`${urlRoot}?${query}`)
}

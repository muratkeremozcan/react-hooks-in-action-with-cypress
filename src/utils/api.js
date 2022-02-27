import { shortISO } from './date-wrangler'

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

  const query =
    `bookableId=${bookableId}` + `&date_gte=${start}&date_lte=${end}`

  return getData(`${urlRoot}?${query}`)
}

const fetcher = (url, method, item) =>
  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: item ? JSON.stringify(item) : null
  }).then((r) => {
    if (!r.ok) {
      throw new Error('There was a problem creating the item!')
    }
    return r.json()
  })

export function createItem(url, item) {
  return fetcher(url, 'POST', item)
}

export function editItem(url, item) {
  return fetcher(url, 'PUT', item)
}

export function deleteItem(url) {
  return fetcher(url, 'DELETE')
}

/** Sends a get request, checks the response for errors, converts the response to a js object */
export default function getData(url) {
  return fetch(url).then((resp) => {
    if (!resp.ok) throw new Error('There was a problem fetching the data')

    return resp.json()
  })
}

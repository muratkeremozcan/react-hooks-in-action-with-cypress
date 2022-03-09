import { Link, useParams } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa'

import { useQuery } from 'react-query'
import getData from '../../utils/api'

import BookablesList from './BookablesList'
import BookableDetails from './BookableDetails'
// import PageSpinner from '../UI/PageSpinner' // (12.2) use Suspense instead

export default function BookablesView() {
  // [10.4.2] useQuery is similar to our custom useFetch: takes a url, returns an object of data, status & error
  // the key arg is a unique identifier for the query / data in cache; string, array or object
  // the 2nd arg an async function that returns the data
  // const { data, status, error } = useQuery(key, () => fetch(url))
  // Whenever any component subsequently calls useQuery with the key,
  // React Query will return the previously fetched  data from its cache
  // and then fetch the latest data in the background (very similar to PWAs and service workers)
  // const {
  //   data: bookables = [],
  //   status,
  //   error
  // } = useQuery('bookables', () => getData('http://localhost:3001/bookables'))
  // instead of the above...

  // [12.2] use Suspense & ErrorBoundary: useQuery takes a third arg as a configuration option
  // which tells useQuery to suspend (throw a promise) when loading its initial data
  // remember the 3 way results from (12.0) while loading show the Suspense, if success show the component, if error show the ErrorBoundary
  const { data: bookables = [] } = useQuery(
    'bookables',
    () => getData('http://localhost:3001/bookables'),
    {
      suspense: true
    }
  )

  // [10.1] using path attributes to extract state values from the url
  /*

  // [10.1.0] setup the route at the Route component
  // path attributes are flavor and size
  <Route path="/milkshake/:flavor/:size" element={<Milkshake/>}/>

  // url is this
  /milkshake/vanilla/medium

  // url is mapped to path attributes
  {
    flavor: "vanilla",
    size: "medium"
  }

  // [10.1.1] useParams returns an object with properties corresponding to URL parameters
  const {flavor, size} = useParams()

  */
  const { id } = useParams()

  const bookable =
    bookables.find((b) => b.id === parseInt(id, 10)) || bookables[0]

  // [6.4] why useCallback?
  // custom functions get defined on every render and can cause network spam.
  // useCallback lets us memoize functions. To prevent the redefinition or recalculation of values.
  // useCallBack(updaterFn, [dependencies])

  // will cause network spam
  // const updateBookable = (selected) => {
  //   if (selected) {
  //     selected.lastShown = Date.now()
  //     return setBookable(selected)
  //   }
  //   return null
  // }

  /** Checks that the bookable exists and adds a timestamp property before updating state.
   * Uses useCallback to prevent unnecessary re-renders.*/
  // const updateBookable = useCallback((selected) => {
  //   if (selected) {
  //     selected.lastShown = Date.now()
  //     return setBookable(selected)
  //   }
  //   return null
  //   // runs once
  // }, [])

  // (12.2) use Suspense and ErrorBoundary instead
  // if (status === 'error') {
  //   return <p>{error.message}</p>
  // }

  // if (status === 'loading') {
  //   return <PageSpinner />
  // }

  // [6.0] parent & children sharing state
  // when components use the same data to build their UI,
  // we can share that data by passing it as a prop from parent to child (simplest state management)
  return (
    <main data-cy="bookables-view" className="bookables-page">
      <div>
        <BookablesList
          bookable={bookable}
          bookables={bookables}
          getUrl={(id) => `/bookables/${id}`}
        />

        <p className="controls">
          <Link to="/bookables/new" replace={true} className="btn">
            <FaPlus />
            <span data-cy="new-bookable">New</span>
          </Link>
        </p>
      </div>

      <BookableDetails bookable={bookable} />
    </main>
  )
}

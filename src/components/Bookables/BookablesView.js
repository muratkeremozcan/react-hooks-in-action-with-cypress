import { Link, useParams } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa'

import useFetch from '../../utils/useFetch'

import BookablesList from './BookablesList'
import BookableDetails from './BookableDetails'
import PageSpinner from '../UI/PageSpinner'

export default function BookablesView() {
  // const [bookable, setBookable] = useState()
  // [9.5.1] using the custom hook, we can simplify the state
  const {
    data: bookables = [],
    status,
    error
  } = useFetch('http://localhost:3001/bookables')

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
  // updater & dispatch from useState and useReducer are guaranteed to have unique identities
  // but custom functions get defined on every render and can cause network spam.
  // useCallback to the rescue! useCallback lets us memoize functions. To prevent the redefinition or recalculation of values.
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

  if (status === 'error') {
    return <p>{error.message}</p>
  }

  if (status === 'loading') {
    return <PageSpinner />
  }

  // [6.0] parent & children sharing state
  // when components use the same data to build their UI,
  // share that data by passing it as a prop from parent to child
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
            <span>New</span>
          </Link>
        </p>
      </div>

      <BookableDetails bookable={bookable} />
    </main>
  )
}

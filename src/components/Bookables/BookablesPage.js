import { Routes, Route } from 'react-router-dom'

import BookablesView from './BookablesView'
import BookableEdit from './BookableEdit'
import BookableNew from './BookableNew'

// [10.1.0] using path attributes extract state values from the url: Setup the routes
// /bookables/1   bookables/    bookables/1/edit   bookables/new
// https://reactrouter.com/docs/en/v6/getting-started/overview
export default function BookablesPage() {
  return (
    <>
      <Routes>
        {/* Use parameters in routes by pre-pending parameter names with a colon */}
        <Route path="/:id" element={<BookablesView />} />
        <Route path="/" element={<BookablesView />} />
        <Route path="/:id/edit" element={<BookableEdit />} />
        <Route path="/new" element={<BookableNew />} />
        {/* question: why doesn't the below version work? */}
        {/* <Route path="/:id">
          <BookablesView />
        </Route>
        <Route path="/">
          <BookablesView />
        </Route>
        <Route path="/:id/edit">
          <BookableEdit />
        </Route>
        <Route path="/new">
          <BookableNew />
        </Route> */}
      </Routes>
    </>
  )
}

// note about component testing:
// the route does not default to a path, therefore no component is rendered on mount
// all the children are tested in full, and this component should be tested at ui-integration level

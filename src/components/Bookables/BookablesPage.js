import { Routes, Route, Link } from 'react-router-dom'

import BookablesView from './BookablesView'
import BookableEdit from './BookableEdit'
import BookableNew from './BookableNew'

// [10.1.0] using path attributes extract state values from the url: Setup the routes
// /bookables/1   bookables/    bookables/1/edit   bookables/new
// https://reactrouter.com/docs/en/v6/getting-started/overview
export default function BookablesPage() {
  return (
    <>
      {/* question: why doesn't it default to a path? How do we test this with component testing?
      makes sense; same thing in App.cy.js test, we have to click on routes for them to appear
      */}
      <nav>
        <Link to="/2">Test</Link>
      </nav>
      <Routes>
        <Route path="/:id" element={<BookablesView />} />
        <Route path="/" element={<BookablesView />} />
        <Route path="/:id/edit" element={<BookableEdit />} />
        <Route path="/new" element={<BookableNew />} />

        {/* question: why doesn't the below version does work? */}
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

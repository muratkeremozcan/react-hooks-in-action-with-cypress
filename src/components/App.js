import { useState, lazy, Suspense } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import '../App.css'
import { FaCalendarAlt, FaDoorOpen, FaUsers } from 'react-icons/fa'
import UserPicker from './Users/UserPicker'
import PageSpinner from './UI/PageSpinner'
import ErrorComp from './UI/ErrorComp'

// use lazy loading instead (11.1)
// import BookablesPage from './Bookables/BookablesPage'
// import BookingsPage from './Bookings/BookingsPage'
// import UsersPage from './Users/UsersPage'
// [8.1] import the context object
import UserContext from './Users/UserContext'
// import ErrorBoundary from './UI/ErrorBoundary'
import { ErrorBoundary } from 'react-error-boundary'

// [10.4.1]
const queryClient = new QueryClient()

// Use the Suspense component to wrap UI that contains one or more lazy components in its tree
// React provides an easy way to specify fallback UI: the Suspense component

// ch[11.0] lazy loading & suspense
// [11.1] lazy load the components instead of importing them at the top
const BookablesPage = lazy(() => import('./Bookables/BookablesPage'))
const BookingsPage = lazy(() => import('./Bookings/BookingsPage'))
const UsersPage = lazy(() => import('./Users/UsersPage'))

export default function App() {
  // [8.2] identify the state to be passed down
  const [user, setUser] = useState()

  // [10.4.0] why react-query? https://react-query.tanstack.com/
  // to prevent duplicated data-fetching, we want to move all the data-fetching code into a central store
  // and access that single source from the components that need it.
  // With React Query, we don’t need to do any of the work involved in creating such a store.
  // It lets us keep the data-fetching code in the components that need the data,
  // but behind the scenes it manages a data cache, passing already-fetched data to components when they ask for them

  // [10.4.1] For components to access a shared React Query cache,
  // we make the cache available by wrapping our app JSX in a provider component
  // [8.3] wrap the UI with the context’s Provider component, using the state as a prop
  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={user}>
        <Router>
          <div className="App">
            <header>
              <nav>
                <ul>
                  <li>
                    <Link to="/bookings" className="btn btn-header">
                      <FaCalendarAlt />
                      <span>Bookings</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/bookables" className="btn btn-header">
                      <FaDoorOpen />
                      <span>Bookables</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/users" className="btn btn-header">
                      <FaUsers />
                      <span>Users</span>
                    </Link>
                  </li>
                </ul>
              </nav>

              <UserPicker user={user} setUser={setUser} />
            </header>

            {/* [11.3] Error boundary is a way for the app to show common error when lazy loaded components fail to load */}
            <ErrorBoundary fallback={<ErrorComp />}>
              {/* [11.2]
            // React provides an easy way to specify fallback UI: the Suspense component
            // Use the Suspense component to wrap UI that contains one or more lazy components in its tree
            */}

              <Suspense fallback={<PageSpinner />}>
                {/*  // https://reactrouter.com/docs/en/v6/getting-started/overview */}
                <Routes>
                  <Route path="/bookings" element={<BookingsPage />} />
                  {/* ch[10.0] using path attributes for Route components to extract state values
                // enable nested routes with /*  */}
                  <Route path="/bookables/*" element={<BookablesPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="*" element={<BookingsPage />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </div>
        </Router>
      </UserContext.Provider>
    </QueryClientProvider>
  )
}

// with Suspense and Error boundary, there are problems with component testing App.js
// philosophically, component testing App.js is not a good idea to begin with

// import { mount } from '@cypress/react'
// import App from './App'
// import UserContext from './Users/UserContext'
// const users = require('../../cypress/fixtures/users.json')

// const testRoute = (route) =>
//   cy
//     .contains(route, { matchCase: false })
//     .click()
//     .location('pathname')
//     .should('equal', `/${route}`)

// describe('App component', { viewportWidth: 900, viewportHeight: 900 }, () => {
//   const cmp = <App />

//   beforeEach(() => {
//     cy.intercept('GET', 'http://localhost:3001/users', {
//       fixture: 'users'
//     }).as('userStub')

//     cy.intercept('GET', 'http://localhost:3001/bookables', {
//       fixture: 'bookables'
//     }).as('bookablesStub')
//   })

//   it('should verify routes', () => {
//     mount(<UserContext.Provider value={users[0]}>{cmp}</UserContext.Provider>)

//     cy.get('nav').should('be.visible')

//     testRoute('bookings')
//     testRoute('bookables')
//     testRoute('users')
//   })
// })

import { useState, useCallback } from 'react'

import BookablesList from './BookablesList'
import BookableDetails from './BookableDetails'

export default function BookablesView() {
  const [bookable, setBookable] = useState()

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
  const updateBookable = useCallback((selected) => {
    if (selected) {
      selected.lastShown = Date.now()
      return setBookable(selected)
    }
    return null
    // runs once
  }, [])

  // [6.0] parent & children sharing state
  // when components use the same data to build their UI,
  // share that data by passing it as a prop from parent to child
  return (
    <>
      {/* [6.1] if a child needs to have and/or update state, pass state and/or the updater function to it */}
      <BookablesList bookable={bookable} setBookable={updateBookable} />
      <BookableDetails bookable={bookable} />
    </>
  )
}

/* [3.0] Why useReducer?
  When state values are related, affecting each other or being changed together
  it can help to move the state update logic into a single place
  rather than spreading the code that performs changes across event handler functions like this:

  const changeGroup = (event) => {
    setGroup(event.target.value)
    return setBookableIndex(0)
  }

  React gives us the useReducer hook to help us manage this collocation of state update logic

  A reducer is a function that accepts a state value and an action value.
  It generates a new state value based on the two values passed in, then returns the new state value.

  const [state, dispatch] = useReducer(reducer, initialState)
  */

export default function reducer(state, action) {
  /** count of bookables */
  const count = state.bookables.filter((b) => b.group === state.group).length

  /** need real modulus for negative numbers */
  const mod = (n, m) => ((n % m) + m) % m

  // [3.4] In the reducer, use if or switch statements to check for the type of action dispatched
  // In the default case, either return the unchanged state (if the reducer will be combined with other reducers)
  // or throw an error (if the reducer should never receive an unknown action type).
  switch (action.type) {
    case 'SET_GROUP':
      return {
        ...state,
        group: action.payload,
        // when changing the group, reset the index to 0 so that you have something selected instead of limbo
        bookableIndex: 0
      }

    case 'SET_BOOKABLE':
      return {
        ...state,
        bookableIndex: action.payload
      }

    case 'TOGGLE_HAS_DETAILS':
      return {
        ...state,
        hasDetails: !state.hasDetails
      }

    case 'NEXT_BOOKABLE':
      return {
        ...state,
        bookableIndex: (state.bookableIndex + 1) % count
      }

    case 'PREVIOUS_BOOKABLE':
      return {
        ...state,
        bookableIndex: mod(state.bookableIndex - 1, count)
      }

    case 'FETCH_BOOKABLES_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: false,
        // during the fetch, there is nothing to be displayed
        bookables: []
      }

    case 'FETCH_BOOKABLES_SUCCESS':
      return {
        ...state,
        isLoading: false,
        bookables: action.payload
      }

    case 'FETCH_BOOKABLES_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }

    default:
      return state
  }
}

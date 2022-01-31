/* [3.0] Why useReducer?
  When state values are related, affecting each other or being changed together
  it can help to move the state update logic into a single place
  rather than spreading the code that performs changes across event handler functions

  const changeGroup = (event) => {
    setGroup(event.target.value)
    return setBookableIndex(0)
  }

  React gives us the useReducer hook to help us manage this collocation of state update logic

  A reducer is a function that accepts a state value and an action value.
  It generates a new state value based on the two values passed in, then returns the new state value.
*/

// the component has 4 pieces of state: group, bookableIndex, hasDetails, and bookables (from json)

export default function reducer(state, action) {
  /** count of bookables */
  const count = state.bookables.filter((b) => b.group === state.group).length

  /** need real modulus for negative numbers */
  const mod = (n, m) => ((n % m) + m) % m

  switch (action.type) {
    case 'SET_GROUP':
      return {
        ...state,
        group: action.payload,
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

    default:
      return state
  }
}

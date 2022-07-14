import { getWeek } from '../../utils/date-wrangler'

// [3.4] In the reducer, use if or switch statements to check for the type of action dispatched
// the reducer takes a state and action as args, and switches the action.type
// In the default case, either return the unchanged state (if the reducer will be combined with other reducers)
// or throw an error (if the reducer should never receive an unknown action type).

export default function reducer(state, action) {
  switch (action.type) {
    case 'NEXT_WEEK':
      return getWeek(state.date, 7)
    case 'PREV_WEEK':
      return getWeek(state.date, -7)
    case 'TODAY':
      return getWeek(new Date())
    case 'SET_DATE':
      return getWeek(new Date(action.payload))
    default:
      throw new Error(`Unknown action type: ${action.type}`)
  }
}

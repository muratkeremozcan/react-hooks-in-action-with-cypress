import { useNavigate } from 'react-router-dom'
import { useQueryClient, useMutation } from 'react-query'

import useFormState from './useFormState'
import { createItem } from '../../utils/api'

import BookableForm from './BookableForm'
import PageSpinner from '../UI/PageSpinner'

export default function BookableNew() {
  // [10.2] React Router’s useNavigate returns a function we can use to direct-nav
  const navigate = useNavigate()
  const formState = useFormState()
  // [10.6.1] recall useQueryClient from (10.5.0), there it was used to retrieve the cache
  // here it will be used to set the cache
  const queryClient = useQueryClient()

  // [10.6.0] why useMutation?
  // useParams and useQuery fetch state: UI state <- server/url , and caches it
  // useMutation is just the opposite: UI state -> server , and still caches it
  // yields data, status, error just like useQuery (10.4.2)
  // const { dataToMutate, status, error } = useMutation((url) => fetch(url) {.. non-idempotent (POST for example) ..})
  // the first arg is a function that that executes a non-idempotent request
  // the second arg is an object with onSuccess property
  const {
    mutate: createBookable,
    status,
    error
  } = useMutation(
    (item) => createItem('http://localhost:3001/bookables', item),

    {
      onSuccess: (bookable) => {
        // [10.6.2] use queryClient's setQueryData to set the cache
        // takes a key as the first arg, the 2nd arg is a cb that takes the old query cache and returns the new one
        queryClient.setQueryData('bookables', (old) => [
          ...(old || []),
          bookable
        ])

        // as an extra, we direct navigate to the new item
        return navigate(`/bookables/${bookable.id}`)
      }
    }
  )

  function handleSubmit() {
    return createBookable(formState.state)
  }

  if (status === 'error') {
    return <p data-cy="error">{error.message}</p>
  }

  if (status === 'loading') {
    return <PageSpinner />
  }

  return (
    <BookableForm
      data-cy="bookable-new"
      formState={formState}
      handleSubmit={handleSubmit}
    />
  )
}

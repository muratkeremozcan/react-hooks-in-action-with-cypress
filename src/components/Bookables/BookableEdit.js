import { useParams } from 'react-router-dom'
import { useQueryClient, useQuery } from 'react-query'

import useFormState from './useFormState'
import getData from '../../utils/api'

import BookableForm from './BookableForm'
import PageSpinner from '../UI/PageSpinner'

export default function BookableEdit() {
  // [10.1.1] useParams returns an object with properties corresponding to URL parameters
  const { id } = useParams()

  // [10.5.0] React Query makes the cache available to components via the client object
  // this is for being able to use cache when direct navigating via a url
  const queryClient = useQueryClient()

  // [10.4.2] useQuery takes a url, returns an object of data, status & error
  // the key arg is a unique identifier which can be an array, string or object
  // the 2nd arg an async function that returns the data
  // [10.4.3] useQuery can be called with a 3rd arg, a config object with initialData property
  // [10.5.1] useQueryClient.getQueryData() allows to access the already fetched cached data
  const { data, isLoading, error } = useQuery(
    ['bookable', id],
    () => getData(`http://localhost:3001/bookables/${id}`),
    {
      initialData: queryClient
        .getQueryData('bookables')
        ?.find((b) => b.id === parseInt(id, 10))
    }
  )

  const formState = useFormState(data)

  function handleDelete() {
    console.log('handleDelete')
  }

  function handleSubmit() {
    console.log('handleSubmit')
  }

  if (error) {
    return <p data-cy="error">{error.message}</p>
  }

  if (isLoading) {
    return <PageSpinner />
  }

  return (
    <BookableForm
      data-cy="bookable-edit"
      formState={formState}
      handleSubmit={handleSubmit}
      handleDelete={handleDelete}
    />
  )
}

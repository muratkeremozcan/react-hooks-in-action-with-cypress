import { useNavigate, useParams } from 'react-router-dom'
import { useQueryClient, useMutation, useQuery } from 'react-query'

import useFormState from './useFormState'
import getData, { editItem, deleteItem } from '../../utils/api'

import BookableForm from './BookableForm'
import PageSpinner from '../UI/PageSpinner'

export default function BookableEdit() {
  // [10.1.1] useParams returns an object with properties corresponding to URL parameters
  const { id } = useParams()
  const { data, isLoading, error } = useBookable(id)
  const formState = useFormState(data)

  // get the mutation function and status booleans for updating the bookable
  const { updateBookable, isUpdating, isUpdateError, updateError } =
    useUpdateBookable()

  // get the mutation function and status booleans for deleting the bookable
  const { deleteBookable, isDeleting, isDeleteError, deleteError } =
    useDeleteBookable()

  function handleDelete() {
    if (window.confirm('Are you sure you want to delete the bookable?')) {
      // call the mutation function for deleting the bookable
      return deleteBookable(formState.state)
    }
    return null
  }

  function handleSubmit() {
    return updateBookable(formState.state)
  }

  if (error || isUpdateError || isDeleteError) {
    return (
      <p data-cy="error">
        {error?.message} || {updateError?.message} || {deleteError?.message}
      </p>
    )
  }

  if (isLoading || isUpdating || isDeleting) {
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

function useBookable(id) {
  // [10.5.0] React Query makes the cache available to components via the client object
  // useQueryClient is for being able to use cache when direct navigating via a url
  const queryClient = useQueryClient()
  // [10.4.2] useQuery is for fetching data (by key) and caching it, while updating cache
  // const { data, status, error } = useQuery(key, () => fetch(url))
  // the key arg is a unique identifier for the query / data in cache; string, array or object
  // the 2nd arg an async function that returns the data
  // [10.4.3] useQuery can be called with a 3rd arg, a config object with initialData property
  // [10.5.1] useQueryClient.getQueryData() allows to access the already fetched cached data
  return useQuery(
    ['bookable', id],
    () => getData(`http://localhost:3001/bookables/${id}`),
    {
      // refetching causes problems after deleting a bookable
      refetchOnWindowFocus: false,

      initialData: queryClient
        .getQueryData('bookables')
        ?.find((b) => b.id === parseInt(id, 10))
    }
  )
}

function useUpdateBookable() {
  // [10.2] React Router’s useNavigate returns a function we can use to direct-nav
  const navigate = useNavigate()
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
  const mutation = useMutation(
    (item) => editItem(`http://localhost:3001/bookables/${item.id}`, item),
    {
      onSuccess: (bookable) => {
        // replace the pre-edited version in the "bookables" cache
        // with the edited bookable
        updateBookablesCache(bookable, queryClient)

        // do the same for the individual "bookable" cache
        // [10.6.2] use queryClient's setQueryData to set the cache
        // takes a key as the first arg, the 2nd arg is the new cache
        queryClient.setQueryData(['bookable', String(bookable.id)], bookable)

        // show the updated bookable
        navigate(`/bookables/${bookable.id}`)
      }
    }
  )

  // const { dataToMutate, status, error }
  return {
    updateBookable: mutation.mutate,
    isUpdating: mutation.isLoading,
    isUpdateError: mutation.isError,
    updateError: mutation.error
  }
}

/* Replace a bookable in the cache with the updated version. */
function updateBookablesCache(bookable, queryClient) {
  // get all the bookables from the cache
  const bookables = queryClient.getQueryData('bookables') || []

  // find the index in the cache of the bookable that's been edited
  const bookableIndex = bookables.findIndex((b) => b.id === bookable.id)

  // if found, replace the pre-edited version with the edited one
  if (bookableIndex !== -1) {
    bookables[bookableIndex] = bookable
    // [10.6.2] use queryClient's setQueryData to set the cache
    // takes a key as the first arg, the 2nd arg is the new cache
    return queryClient.setQueryData('bookables', bookables)
  } else return null
}

function useDeleteBookable() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (item) => deleteItem(`http://localhost:3001/bookables/${item.id}`),
    {
      /* on success receives the original item as a second argument */
      onSuccess: (_, bookable) => {
        // get all the bookables from the cache
        const bookables = queryClient.getQueryData('bookables') || []

        // set the bookables cache without the deleted one
        queryClient.setQueryData(
          'bookables',
          bookables.filter((b) => b.id !== bookable.id)
        )

        // If there are other bookables in the same group as the deleted one, navigate to the first
        navigate(
          `/bookables/${getIdForFirstInGroup(bookables, bookable) || ''}`
        )
      }
    }
  )

  return {
    deleteBookable: mutation.mutate,
    isDeleting: mutation.isLoading,
    isDeleteError: mutation.isError,
    deleteError: mutation.error
  }
}

function getIdForFirstInGroup(bookables, excludedBookable) {
  // get the id and group of the deleted bookable
  const { id, group } = excludedBookable

  // find the first other bookable in the same group as the deleted one
  const bookableInGroup = bookables.find(
    (b) => b.group === group && b.id !== id
  )

  // return its id or undefined
  return bookableInGroup?.id
}

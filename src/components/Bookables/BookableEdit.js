import BookableForm from './BookableForm'
import useFormState from './useFormState'

export default function BookableEdit() {
  const status = 'success'
  const error = { message: 'Error!' }
  const formState = useFormState()

  function handleDelete() {
    console.log('handleDelete')
  }

  function handleSubmit() {
    console.log('handleSubmit')
  }

  if (status === 'error') {
    return <p>{error.message}</p>
  }

  if (status === 'loading') {
    return <p>Loading!!!</p>
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

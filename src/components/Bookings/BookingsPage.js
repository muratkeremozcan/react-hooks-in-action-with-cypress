import WeekPicker from './WeekPicker'

export default function BookablesPage() {
  return (
    <main className="bookings-page">
      <WeekPicker date={new Date()} />
    </main>
  )
}

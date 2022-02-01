import dayjs from 'dayjs'

export const addDays = (date, daysToAdd) => dayjs(date).add(daysToAdd, 'day').$d

export function getWeek(forDate, daysOffset = 0) {
  const date = addDays(forDate, daysOffset)
  const day = date.getDay()

  return {
    date,
    start: addDays(date, -day),
    end: addDays(date, 6 - day)
  }
}

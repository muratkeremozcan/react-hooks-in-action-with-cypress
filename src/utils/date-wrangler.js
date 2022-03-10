import dayjs from 'dayjs'

export const addDays = (date, daysToAdd) => dayjs(date).add(daysToAdd, 'day').$d

/** returns an object with the current date, start and end of the week  */
export function getWeek(forDate, daysOffset = 0) {
  const date = addDays(forDate, daysOffset)
  const day = date.getDay()

  return {
    date,
    start: addDays(date, -day),
    end: addDays(date, 6 - day)
  }
}

export function shortISO(date) {
  return date.toISOString().split('T')[0]
}

export const isDate = (date) => !isNaN(Date.parse(date))

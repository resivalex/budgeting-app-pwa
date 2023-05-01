import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export function convertToLocaleTime(date: string | Date): string {
  const utcTime = dayjs.utc(date)
  const localTime = utcTime.local()

  return localTime.format('YYYY-MM-DD HH:mm:ss')
}

export function convertToUtcTime(date: string | Date): string {
  const localTime = dayjs(date)
  const utcTime = localTime.utc()

  return utcTime.format('YYYY-MM-DD HH:mm:ss')
}

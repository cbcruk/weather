import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(isSameOrAfter)
dayjs.extend(utc)
dayjs.extend(timezone)

export function getTimezoneDate(date = new Date()) {
  const tzDate = dayjs(date).tz('Asia/Seoul')

  return tzDate
}

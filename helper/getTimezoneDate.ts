import dayjs from 'dayjs'

export function getTimezoneDate(date = new Date()) {
  const tzDate = dayjs(date).tz('Asia/Seoul')

  return tzDate
}

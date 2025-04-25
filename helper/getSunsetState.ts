import sunCalc from 'suncalc'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { SUNSET_STATE } from '@/constants'

dayjs.extend(isSameOrAfter)
dayjs.extend(utc)
dayjs.extend(timezone)

type GetSunsetStateParams = {
  date?: Date
  coords: Partial<GeolocationCoordinates>
}

export function getSunsetState({
  date = new Date(),
  coords,
}: GetSunsetStateParams) {
  const tzDate = dayjs(date).tz('Asia/Seoul')
  const times = sunCalc.getTimes(
    tzDate.toDate(),
    coords.latitude || 0,
    coords.longitude || 0
  )

  const isNight = tzDate.isSameOrAfter(times.sunset)

  return isNight ? SUNSET_STATE.night : SUNSET_STATE.morning
}

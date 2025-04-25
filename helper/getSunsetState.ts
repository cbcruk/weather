import sunCalc from 'suncalc'
import { SUNSET_STATE } from '@/constants'
import { getTimezoneDate } from './getTimezoneDate'

type GetSunsetStateParams = {
  date?: Date
  coords: Partial<GeolocationCoordinates>
}

export function getSunsetState({ date, coords }: GetSunsetStateParams) {
  const tzDate = getTimezoneDate(date)
  const times = sunCalc.getTimes(
    tzDate.toDate(),
    coords.latitude || 0,
    coords.longitude || 0
  )

  const isNight = tzDate.isSameOrAfter(times.sunset)

  return isNight ? SUNSET_STATE.night : SUNSET_STATE.morning
}

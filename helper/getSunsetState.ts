import sunCalc from 'suncalc'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

dayjs.extend(isSameOrAfter)

export const SUNSET_STATE = {
  morning: 'morning',
  afternoon: 'afternoon',
  night: 'night',
}

function getSunsetState(coords: Partial<GeolocationCoordinates>) {
  const times = sunCalc.getTimes(
    new Date(),
    coords.latitude || 0,
    coords.longitude || 0
  )

  const isNight = dayjs().isSameOrAfter(dayjs(times.sunset))

  return isNight ? SUNSET_STATE.night : SUNSET_STATE.morning
}

export default getSunsetState

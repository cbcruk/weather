import { THEME_STATE } from '@/constants'
import { getTimes } from 'suncalc'

type Params = Partial<GeolocationCoordinates>

export function getThemeByGeolocation({ latitude, longitude }: Params) {
  const now = new Date()
  const { sunrise, sunset } = getTimes(now, latitude || 0, longitude || 0)
  const theme =
    now < sunrise || now > sunset ? THEME_STATE.DARK : THEME_STATE.LIGHT

  return theme
}

import { THEME_STATE } from '@/constants'
import { getSunsetState } from './getSunsetState'

type Params = Parameters<typeof getSunsetState>[0]

export function getThemeBySunsetState(params: Params) {
  const state = getSunsetState(params)
  const theme = state === 'night' ? THEME_STATE.DARK : THEME_STATE.LIGHT

  return theme
}

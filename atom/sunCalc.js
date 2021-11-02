import { atom } from 'jotai'
import getSunsetState from '../helper/getSunsetState'
import { coordsAtom } from './coords'

export const SUNSET_STATE = {
  afternoon: 'afternoon',
  night: 'night',
  morning: 'morning',
}

const calcSunsetAtom = atom((get) => {
  const coords = get(coordsAtom)

  return getSunsetState(coords)
})

export const sunsetAtom = atom((get) => get(calcSunsetAtom))

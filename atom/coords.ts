import { atom } from 'jotai'
import { getGeolocation } from '../helper'
import { isSSR } from '../helper/ssr'
import { DEFAULT_COORDS } from '@/constants'

export const coordsAtom = atom(
  isSSR
    ? DEFAULT_COORDS
    : JSON.parse(localStorage.getItem('LATLNG') || '{}') || DEFAULT_COORDS
)

export const permissionAtom = atom(async () => {
  const result = await navigator.permissions.query({ name: 'geolocation' })

  return result.state
})

export const fetchCoordsAtom = atom(
  (get) => get(coordsAtom),
  async (_get, set) => {
    const latlng = await getGeolocation()

    localStorage.setItem('LATLNG', JSON.stringify(latlng))

    set(coordsAtom, latlng)
  }
)

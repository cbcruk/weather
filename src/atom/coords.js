import { atom } from 'jotai'
import { getGeolocation } from '../helper'

export const coordsAtom = atom(
  JSON.parse(localStorage.getItem('LATLNG')) || {
    latitude: 37.5642135,
    longitude: 127.0016985,
  }
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

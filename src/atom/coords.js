import { atom } from 'jotai'
import { getGeolocation } from '../helper'

export const coordsAtom = atom(async () => {
  const latlng = await getGeolocation()
  return latlng
})

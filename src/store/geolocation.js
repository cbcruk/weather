import create from 'zustand'
import { getGeolocation, getRegionCodeByCoords } from '../helper'

const useStore = create((set) => ({
  coords: null,
  regionCode: null,
  status: 'idle',
  fetch: async () => {
    set({ status: 'request' })

    try {
      const coords = await getGeolocation()
      const regionCode = await getRegionCodeByCoords(coords)

      set({ coords, regionCode, status: 'success' })
    } catch (error) {
      set({ status: 'failure' })
    }
  },
}))

export default useStore

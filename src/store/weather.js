import create from 'zustand'
import { getWeatherInfo } from '../helper'

const useStore = create((set) => ({
  data: null,
  status: 'idle',
  fetch: async (regionCode) => {
    set({ status: 'request' })

    try {
      const data = await getWeatherInfo(regionCode)

      set({ data, status: 'success' })
    } catch (error) {
      set({ status: 'failure' })
    }
  },
}))

export default useStore

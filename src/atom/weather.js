import { atom } from 'jotai'
import { atomWithQuery } from 'jotai/query'
import { getWeatherInfo } from '../helper'
import { coordsAtom } from './coords'

export const fetchWeatherAtom = atomWithQuery((get) => {
  return {
    queryKey: ['weather', get(coordsAtom)],
    async queryFn({ queryKey: [, coords] }) {
      const response = await getWeatherInfo(coords)

      return response
    },
    refetchInterval: 1000 * 60 * 5,
  }
})

export const weatherAtom = atom((get) => get(fetchWeatherAtom))

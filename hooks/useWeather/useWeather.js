import { useQuery } from 'react-query'
import { getWeatherInfo } from '../../helper'

export const KEY = 'weather'

export function useWeather() {
  const result = useQuery(KEY, () => getWeatherInfo(), {
    refetchInterval: 1000 * 60 * 5,
  })

  return result
}

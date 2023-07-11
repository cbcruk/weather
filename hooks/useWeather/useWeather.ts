import { useQuery } from '@tanstack/react-query'
import { getWeatherInfo } from '../../helper'

export function useWeather() {
  const result = useQuery({
    queryKey: ['weather'],
    queryFn: () => getWeatherInfo(),
    refetchInterval: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  return result
}

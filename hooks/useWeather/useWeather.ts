import { useQuery } from '@tanstack/react-query'
import { THEME_STATE } from '@/constants'
import { Geocode } from '@/helper/getGeolocationData'
import { Weather } from '@/helper/getWeatherData'

type GetWeatherDataResponse = {
  geo: Geocode
  weather: Weather
  theme: keyof typeof THEME_STATE
}

async function getWeatherData() {
  const response = await fetch('/api/weather')
  const data = await response.json()

  return data as GetWeatherDataResponse
}

export function useWeather() {
  const result = useQuery({
    queryKey: ['weather'],
    queryFn: () => getWeatherData(),
    refetchInterval: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  return result
}

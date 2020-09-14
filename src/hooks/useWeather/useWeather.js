import { useQuery } from 'react-query'
import { getWeatherInfo } from '../../helper'

function useWeather(coords) {
  const result = useQuery(
    ['weather', coords],
    () => coords && getWeatherInfo(coords),
    {
      refetchInterval: 1000 * 60 * 5,
    }
  )

  return result
}

export default useWeather

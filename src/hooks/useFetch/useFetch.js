import { useEffect } from 'react'
import pick from 'lodash/pick'
import useGeolocationStore from './store/geolocation'
import useWeatherStore from './store/weather'

function useFetch() {
  const { fetch: fetchGeolocation, regionCode } = useGeolocationStore((state) =>
    pick(state, ['fetch', 'regionCode'])
  )
  const { fetch: fetchWeather } = useWeatherStore((state) =>
    pick(state, ['fetch', 'data'])
  )

  useEffect(() => {
    fetchGeolocation()

    if (regionCode) {
      fetchWeather(regionCode)
    }
  }, [fetchGeolocation, fetchWeather, regionCode])
}

export default useFetch

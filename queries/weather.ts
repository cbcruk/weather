import {
  getWeatherDataByGeolocation,
  GetWeatherDataByGeolocationParams,
} from '@/helper/getWeatherDataByGeolocation'
import { queryOptions } from '@tanstack/react-query'

export const weatherOptions = (params: GetWeatherDataByGeolocationParams) =>
  queryOptions({
    queryKey: [
      'weather',
      {
        latitude: params.latitude,
        longitude: params.longitude,
      },
    ],
    queryFn: () => getWeatherDataByGeolocation(params),
  })

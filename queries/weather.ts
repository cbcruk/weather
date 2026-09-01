import { Effect } from 'effect'
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
    // v4의 runPromise는 태그된 에러를 그대로 reject 하므로,
    // react-query와 ErrorBoundary가 원본 에러를 받는다.
    queryFn: () => Effect.runPromise(getWeatherDataByGeolocation(params)),
  })

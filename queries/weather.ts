import { Effect } from 'effect'
import {
  getWeatherDataByGeolocation,
  GetWeatherDataByGeolocationParams,
  GetWeatherDataByGeolocationReturn,
} from '@/helper/getWeatherDataByGeolocation'
import {
  loadWeatherSnapshot,
  saveWeatherSnapshot,
} from '@/helper/weatherSnapshot'
import { queryOptions } from '@tanstack/react-query'

export type WeatherQueryData = GetWeatherDataByGeolocationReturn & {
  /** 값이 있으면 마지막으로 성공한 데이터를 보여주는 중이라는 뜻이다. */
  staleAt?: number
}

/**
 * 실패했을 때 빈 화면 대신 마지막으로 성공한 데이터를 보여준다.
 * 낡은 기온이라도 아무것도 없는 것보다 낫고, 언제 기준인지는 화면에 표시한다.
 *
 * 스냅샷은 localStorage 라 클라이언트에만 있다. 서버 프리페치는 스냅샷을
 * 찾지 못해 그대로 실패하고, 이어서 클라이언트가 다시 시도하며 대체한다.
 */
async function fetchWeather(
  params: GetWeatherDataByGeolocationParams
): Promise<WeatherQueryData> {
  try {
    const data = await Effect.runPromise(getWeatherDataByGeolocation(params))

    saveWeatherSnapshot(params, data)

    return data
  } catch (error) {
    const snapshot = loadWeatherSnapshot(params)

    if (!snapshot) {
      throw error
    }

    // 에러를 삼키므로 ErrorBoundary가 볼 수 없다. 여기서 직접 보고한다.
    const { reportClientError } = await import('@/helper/reportClientError')
    reportClientError(error, 'boundary')

    return { ...snapshot.data, staleAt: snapshot.at }
  }
}

export const weatherOptions = (params: GetWeatherDataByGeolocationParams) =>
  queryOptions({
    queryKey: [
      'weather',
      {
        latitude: params.latitude,
        longitude: params.longitude,
      },
    ],
    queryFn: () => fetchWeather(params),
  })

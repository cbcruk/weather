import { Effect } from 'effect'
import { getGeolocationData } from './getGeolocationData'
import { getWeatherData } from './getWeatherData'

export const getWeatherDataByGeolocation = ({
  latitude,
  longitude,
}: GetWeatherDataByGeolocationParams) =>
  Effect.gen(function* () {
    const coords = [longitude, latitude].join(',')
    const geo = yield* getGeolocationData(coords)
    const weather = yield* getWeatherData({ mappingId: geo.code.mappingId })

    return { geo, weather }
  })

export type GetWeatherDataByGeolocationParams = Record<
  'latitude' | 'longitude',
  string
>

export type GetWeatherDataByGeolocationReturn = Effect.Success<
  ReturnType<typeof getWeatherDataByGeolocation>
>

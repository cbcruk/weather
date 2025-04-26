import { getGeolocationData } from './getGeolocationData'
import { getWeatherData } from './getWeatherData'

export async function getWeatherDataByGeolocation({
  latitude,
  longitude,
}: GetWeatherDataByGeolocationParams) {
  const coords = [longitude, latitude].join(',')
  const geo = await getGeolocationData(coords)
  const weather = await getWeatherData({ mappingId: geo.code.mappingId })

  return {
    geo,
    weather,
  }
}

export type GetWeatherDataByGeolocationParams = Record<
  'latitude' | 'longitude',
  string
>

export type GetWeatherDataByGeolocationReturn = Awaited<
  ReturnType<typeof getWeatherDataByGeolocation>
>

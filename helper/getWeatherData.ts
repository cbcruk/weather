import { Effect } from 'effect'
import { DEFAULT_HEADERS } from '@/constants'
import { GeocodeSchema, weatherResponseSchema } from '@/app/schema'
import { fetchJson } from './fetchJson'

const RESOURCE = 'weather'

type Params = {
  mappingId: GeocodeSchema['code']['mappingId']
}

export const getWeatherData = (
  { mappingId }: Params,
  fetchWeatherData = fetch
) =>
  fetchJson({
    resource: RESOURCE,
    url: new URL(`${process.env.API_URL}/api/weather/today/${mappingId}`),
    schema: weatherResponseSchema,
    headers: DEFAULT_HEADERS,
    fetchImpl: fetchWeatherData,
  }).pipe(
    Effect.map(({ halfdayForecast, shortTermForecasts }) => ({
      halfdayForecast,
      shortTermForecasts,
    }))
  )

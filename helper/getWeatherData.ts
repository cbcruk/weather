import { DEFAULT_HEADERS } from '@/constants'
import { GeocodeSchema, weatherResponseSchema } from '@/app/schema'
import { fetchJson } from './fetchJson'

const RESOURCE = 'weather'

type Params = {
  mappingId: GeocodeSchema['code']['mappingId']
}

export async function getWeatherData(
  { mappingId }: Params,
  fetchWeatherData = fetch
) {
  const url = new URL(`${process.env.API_URL}/api/weather/today/${mappingId}`)
  const { halfdayForecast, shortTermForecasts } = await fetchJson({
    resource: RESOURCE,
    url,
    schema: weatherResponseSchema,
    headers: DEFAULT_HEADERS,
    fetchImpl: fetchWeatherData,
  })

  return { halfdayForecast, shortTermForecasts }
}

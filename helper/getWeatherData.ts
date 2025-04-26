import { DEFAULT_HEADERS } from '@/constants'
import { GeocodeSchema, weatherResponseSchema } from '@/app/schema'

type Params = {
  mappingId: GeocodeSchema['code']['mappingId']
}

export async function getWeatherData(
  { mappingId }: Params,
  fetchWeatherData = fetch
) {
  const url = new URL(`${process.env.API_URL}/api/weather/today/${mappingId}`)
  const response = await fetchWeatherData(url, {
    headers: DEFAULT_HEADERS,
  })
  const data = await response.json()
  const { halfdayForecast, shortTermForecasts } =
    weatherResponseSchema.parse(data)

  return { halfdayForecast, shortTermForecasts }
}

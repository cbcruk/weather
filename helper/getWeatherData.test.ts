import { describe, it, expect, vi } from 'vitest'
import { getWeatherData } from './getWeatherData'
import { DEFAULT_HEADERS } from '@/constants'
import { WEATHER_DATA } from './getWeatherData.fixture'

describe('getWeatherData', () => {
  it('fetch', async () => {
    const fetchWeatherData = vi.fn(
      async () => new Response(JSON.stringify(WEATHER_DATA))
    )

    const mappingId = '02610114'

    await getWeatherData({ mappingId }, fetchWeatherData)

    expect(fetchWeatherData).toHaveBeenCalled()
    expect(fetchWeatherData).toHaveBeenCalledWith(
      new URL(`${process.env.API_URL}/api/weather/today/${mappingId}`),
      {
        headers: DEFAULT_HEADERS,
      }
    )
  })
})

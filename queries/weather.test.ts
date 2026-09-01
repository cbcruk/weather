import { describe, it, expect, vi, beforeEach } from 'vitest'
import { weatherOptions } from './weather'
import { saveWeatherSnapshot } from '@/helper/weatherSnapshot'
import { WEATHER_DATA } from '@/helper/getWeatherData.fixture'
import { GEOCODE } from '@/helper/getGeolocationData.fixture'
import { geocodeResultSchema, weatherResponseSchema } from '@/app/schema'

const reportClientError = vi.fn()
vi.mock('@/helper/reportClientError', () => ({
  reportClientError: (...args: unknown[]) => reportClientError(...args),
}))

const params = { latitude: '37.43', longitude: '127.55' }
const snapshot = {
  geo: geocodeResultSchema.parse(GEOCODE.results[0]),
  weather: weatherResponseSchema.parse(WEATHER_DATA),
}

function run() {
  const { queryFn, queryKey } = weatherOptions(params)

  return (queryFn as (ctx: unknown) => Promise<unknown>)({ queryKey })
}

let fetchMock: ReturnType<typeof vi.fn>

beforeEach(() => {
  window.localStorage.clear()
  reportClientError.mockClear()
  fetchMock = vi.fn()
  vi.stubGlobal('fetch', fetchMock)
})

describe('weatherOptions queryFn', () => {
  it('성공하면 스냅샷을 남긴다', async () => {
    fetchMock
      .mockResolvedValueOnce(new Response(JSON.stringify(GEOCODE)))
      .mockResolvedValueOnce(new Response(JSON.stringify(WEATHER_DATA)))

    const result = (await run()) as { staleAt?: number }

    expect(result.staleAt).toBeUndefined()
    expect(
      window.localStorage.getItem(
        `weather-snapshot:${params.latitude},${params.longitude}`
      )
    ).not.toBeNull()
  })

  it('실패해도 스냅샷이 있으면 그것을 staleAt 과 함께 돌려준다', async () => {
    saveWeatherSnapshot(params, snapshot)
    fetchMock.mockResolvedValue(new Response('nope', { status: 404 }))

    const result = (await run()) as { staleAt?: number; geo: unknown }

    expect(result.staleAt).toBeTypeOf('number')
    expect(result.geo).toEqual(snapshot.geo)
  })

  it('스냅샷으로 대체할 때도 에러를 보고한다', async () => {
    saveWeatherSnapshot(params, snapshot)
    fetchMock.mockResolvedValue(new Response('nope', { status: 404 }))

    await run()

    expect(reportClientError).toHaveBeenCalledOnce()
    expect(reportClientError.mock.calls[0]?.[0]).toMatchObject({
      _tag: 'HttpError',
    })
  })

  it('스냅샷이 없으면 에러를 그대로 던진다', async () => {
    fetchMock.mockResolvedValue(new Response('nope', { status: 404 }))

    await expect(run()).rejects.toMatchObject({ _tag: 'HttpError' })
    expect(reportClientError).not.toHaveBeenCalled()
  })
})

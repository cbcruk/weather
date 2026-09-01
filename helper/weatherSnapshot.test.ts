import { describe, it, expect, beforeEach, vi } from 'vitest'
import { loadWeatherSnapshot, saveWeatherSnapshot } from './weatherSnapshot'
import { WEATHER_DATA } from './getWeatherData.fixture'
import { GEOCODE } from './getGeolocationData.fixture'
import { geocodeResultSchema, weatherResponseSchema } from '@/app/schema'

const params = { latitude: '37.43', longitude: '127.55' }
const other = { latitude: '35.17', longitude: '129.07' }
const data = {
  geo: geocodeResultSchema.parse(GEOCODE.results[0]),
  weather: weatherResponseSchema.parse(WEATHER_DATA),
}

beforeEach(() => {
  window.localStorage.clear()
  vi.useRealTimers()
})

describe('weatherSnapshot', () => {
  it('저장한 것을 그대로 돌려준다', () => {
    saveWeatherSnapshot(params, data)

    expect(loadWeatherSnapshot(params)?.data).toEqual(data)
  })

  it('없으면 null', () => {
    expect(loadWeatherSnapshot(params)).toBeNull()
  })

  it('위치가 다르면 남의 스냅샷을 주지 않는다', () => {
    saveWeatherSnapshot(params, data)

    expect(loadWeatherSnapshot(other)).toBeNull()
  })

  it('24시간이 지나면 버린다', () => {
    saveWeatherSnapshot(params, data)
    vi.useFakeTimers()
    vi.setSystemTime(Date.now() + 24 * 60 * 60 * 1000 + 1)

    expect(loadWeatherSnapshot(params)).toBeNull()
  })

  it.each([
    ['JSON이 깨짐', 'not json'],
    ['구조가 다름', JSON.stringify({ at: Date.now(), data: { geo: {} } })],
    ['구버전 스키마', JSON.stringify({ at: Date.now(), data: { foo: 1 } })],
  ])('읽을 수 없는 값은 버린다 — %s', (_label, raw) => {
    window.localStorage.setItem(`weather-snapshot:${params.latitude},${params.longitude}`, raw)

    expect(loadWeatherSnapshot(params)).toBeNull()
  })

  it('localStorage 가 던져도 앱을 막지 않는다', () => {
    const setItem = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('QuotaExceededError')
      })
    const getItem = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new Error('SecurityError')
      })

    expect(() => saveWeatherSnapshot(params, data)).not.toThrow()
    expect(loadWeatherSnapshot(params)).toBeNull()

    setItem.mockRestore()
    getItem.mockRestore()
  })
})

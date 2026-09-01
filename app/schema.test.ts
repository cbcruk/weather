import { describe, it, expect } from 'vitest'
import { weatherResponseSchema, geocodeResponseSchema } from './schema'
import { WEATHER_DATA } from '@/helper/getWeatherData.fixture'
import { GEOCODE } from '@/helper/getGeolocationData.fixture'

describe('weatherResponseSchema', () => {
  it('앱이 쓰는 필드를 파싱한다', () => {
    const parsed = weatherResponseSchema.parse(WEATHER_DATA)

    expect(parsed.shortTermForecasts[0].temperature).toBe(
      WEATHER_DATA.shortTermForecasts[0].temperature
    )
    expect(parsed.halfdayForecast.minTemperature).toBe(
      WEATHER_DATA.halfdayForecast.minTemperature
    )
  })

  // 064e85d 회귀 방지: 쓰지 않는 필드가 바뀌어도 앱이 죽으면 안 된다.
  it.each([
    [
      'airForeCast.stationAddr 가 null (실제 064e85d 장애)',
      { airForeCast: { ...WEATHER_DATA.airForeCast, stationAddr: null } },
    ],
    [
      'airForeCast.pm10 이 문자열로 바뀜',
      { airForeCast: { ...WEATHER_DATA.airForeCast, pm10: '32' } },
    ],
    ['weeklyForecast 가 통째로 사라짐', { weeklyForecast: undefined }],
    ['announcement 가 숫자로 바뀜', { announcement: 1 }],
    ['알 수 없는 필드가 추가됨', { brandNewField: { nested: true } }],
  ])('쓰지 않는 필드 변경을 견딘다 — %s', (_label, patch) => {
    const result = weatherResponseSchema.safeParse({
      ...WEATHER_DATA,
      ...patch,
    })

    expect(result.success).toBe(true)
  })

  it.each([
    [
      '사용하는 temperature 가 문자열',
      {
        shortTermForecasts: [
          { ...WEATHER_DATA.shortTermForecasts[0], temperature: '20' },
        ],
      },
    ],
    ['shortTermForecasts 가 빈 배열', { shortTermForecasts: [] }],
    ['halfdayForecast 가 없음', { halfdayForecast: undefined }],
  ])('사용하는 필드가 깨지면 잡아낸다 — %s', (_label, patch) => {
    const result = weatherResponseSchema.safeParse({
      ...WEATHER_DATA,
      ...patch,
    })

    expect(result.success).toBe(false)
  })
})

describe('geocodeResponseSchema', () => {
  it('앱이 쓰는 필드를 파싱한다', () => {
    const parsed = geocodeResponseSchema.parse(GEOCODE)

    expect(parsed.results[0].code.mappingId).toBe(
      GEOCODE.results[0].code.mappingId
    )
    expect(parsed.results[0].region.area1.name).toBe(
      GEOCODE.results[0].region.area1.name
    )
  })

  it('쓰지 않는 area0/area4 와 coords 변경을 견딘다', () => {
    const [first] = GEOCODE.results
    const result = geocodeResponseSchema.safeParse({
      status: undefined,
      results: [
        {
          ...first,
          region: {
            ...first.region,
            area0: 'gone',
            area4: undefined,
            area1: { ...first.region.area1, coords: 42 },
          },
        },
      ],
    })

    expect(result.success).toBe(true)
  })
})

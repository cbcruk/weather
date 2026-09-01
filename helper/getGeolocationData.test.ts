import { describe, it, expect, vi } from 'vitest'
import { Effect } from 'effect'
import {
  getFetchLocationGeocodeUrl,
  getGeolocationData,
} from './getGeolocationData'
import { GEOCODE } from './getGeolocationData.fixture'
import { DEFAULT_HEADERS } from '@/constants'
import { EmptyResultError } from './errors'

describe('getGeolocationData', () => {
  it('fetch', async () => {
    const fetchLocationGeocode = vi.fn(
      async () => new Response(JSON.stringify(GEOCODE))
    )
    const coords = '127.2236579,37.3728211'
    const geocode = await Effect.runPromise(
      getGeolocationData(coords, fetchLocationGeocode)
    )

    expect(fetchLocationGeocode).toHaveBeenCalled()
    expect(fetchLocationGeocode).toHaveBeenCalledWith(
      getFetchLocationGeocodeUrl(coords),
      {
        headers: DEFAULT_HEADERS,
      }
    )
    // 스키마가 앱이 쓰는 필드만 남기므로 픽스처와 전체 동등 비교하지 않는다.
    const [expected] = GEOCODE.results
    expect(geocode.code.mappingId).toBe(expected.code.mappingId)
    expect(geocode.region.area1.name).toBe(expected.region.area1.name)
    expect(geocode.region.area3.name).toBe(expected.region.area3.name)
  })

  it('results가 비면 EmptyResultError를 던진다', async () => {
    const fetchLocationGeocode = vi.fn(
      async () => new Response(JSON.stringify({ ...GEOCODE, results: [] }))
    )
    const coords = '127.2236579,37.3728211'

    const error = await Effect.runPromise(
      getGeolocationData(coords, fetchLocationGeocode)
    ).catch((e) => e)

    expect(error).toBeInstanceOf(EmptyResultError)
    expect(error.resource).toBe('geocode')
    expect(error.message).toContain(coords)
  })
})

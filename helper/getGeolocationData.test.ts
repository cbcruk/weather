import { describe, it, expect, vi } from 'vitest'
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
    const geocode = await getGeolocationData(coords, fetchLocationGeocode)

    expect(fetchLocationGeocode).toHaveBeenCalled()
    expect(fetchLocationGeocode).toHaveBeenCalledWith(
      getFetchLocationGeocodeUrl(coords),
      {
        headers: DEFAULT_HEADERS,
      }
    )
    expect(geocode).toEqual(GEOCODE.results.at(0))
  })

  it('results가 비면 EmptyResultError를 던진다', async () => {
    const fetchLocationGeocode = vi.fn(
      async () => new Response(JSON.stringify({ ...GEOCODE, results: [] }))
    )
    const coords = '127.2236579,37.3728211'

    const error = await getGeolocationData(coords, fetchLocationGeocode).catch(
      (e) => e
    )

    expect(error).toBeInstanceOf(EmptyResultError)
    expect(error.context).toMatchObject({ resource: 'geocode', coords })
  })
})

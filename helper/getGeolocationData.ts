import { Effect } from 'effect'
import { geocodeResponseSchema } from '@/app/schema'
import { DEFAULT_HEADERS } from '@/constants'
import { EmptyResultError } from './errors'
import { fetchJson } from './fetchJson'

const RESOURCE = 'geocode'

export function getFetchLocationGeocodeUrl(coords: string) {
  const url = new URL(`${process.env.API_URL}/api/location/geocode`)
  url.searchParams.set('orders', 'legalcode')
  url.searchParams.set('coords', coords)

  return url
}

export const getGeolocationData = (
  coords: string,
  fetchLocationGeocode = fetch
) =>
  Effect.gen(function* () {
    const url = getFetchLocationGeocodeUrl(coords)
    const { results } = yield* fetchJson({
      resource: RESOURCE,
      url,
      schema: geocodeResponseSchema,
      headers: DEFAULT_HEADERS,
      fetchImpl: fetchLocationGeocode,
    })
    const [geocode] = results

    if (!geocode) {
      return yield* new EmptyResultError({
        resource: RESOURCE,
        url: url.toString(),
        detail: `coords=${coords}`,
      })
    }

    return geocode
  })

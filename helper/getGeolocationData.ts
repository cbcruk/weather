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

export async function getGeolocationData(
  coords: string,
  fetchLocationGeocode = fetch
) {
  const url = getFetchLocationGeocodeUrl(coords)
  const { results } = await fetchJson({
    resource: RESOURCE,
    url,
    schema: geocodeResponseSchema,
    headers: DEFAULT_HEADERS,
    fetchImpl: fetchLocationGeocode,
  })
  const [geocode] = results

  // results가 비면 예전에는 undefined가 그대로 반환되어,
  // 이를 사용하는 getWeatherDataByGeolocation에서 엉뚱한 TypeError로 터졌다.
  if (!geocode) {
    throw new EmptyResultError({
      resource: RESOURCE,
      url,
      context: { coords },
    })
  }

  return geocode
}

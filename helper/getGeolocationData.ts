import { geocodeResponseSchema } from '@/app/schema'
import { DEFAULT_HEADERS } from '@/constants'

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
  const response = await fetchLocationGeocode(url, {
    headers: DEFAULT_HEADERS,
  })
  const data = await response.json()
  const { results } = geocodeResponseSchema.parse(data)
  const [geocode] = results

  return geocode
}

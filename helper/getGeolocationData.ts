import { DEFAULT_HEADERS } from '@/constants'
import { z } from 'zod'

const schema = z.object({
  status: z.object({ code: z.number(), name: z.string(), message: z.string() }),
  results: z.array(
    z.object({
      name: z.string(),
      code: z.object({
        id: z.string(),
        type: z.string(),
        mappingId: z.string(),
      }),
      region: z.object({
        area0: z.object({
          name: z.string(),
          coords: z.object({
            center: z.object({ crs: z.string(), x: z.number(), y: z.number() }),
          }),
        }),
        area1: z.object({
          name: z.string(),
          coords: z.object({
            center: z.object({ crs: z.string(), x: z.number(), y: z.number() }),
          }),
          alias: z.string(),
        }),
        area2: z.object({
          name: z.string(),
          coords: z.object({
            center: z.object({ crs: z.string(), x: z.number(), y: z.number() }),
          }),
        }),
        area3: z.object({
          name: z.string(),
          coords: z.object({
            center: z.object({ crs: z.string(), x: z.number(), y: z.number() }),
          }),
        }),
        area4: z.object({
          name: z.string(),
          coords: z.object({
            center: z.object({ crs: z.string(), x: z.number(), y: z.number() }),
          }),
        }),
      }),
    })
  ),
})

export type Geocode = z.infer<typeof schema>['results'][number]

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
  const { results } = schema.parse(data)
  const [geocode] = results

  return geocode
}

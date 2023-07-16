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

export async function getGeolocationData(coords: string) {
  const url = new URL(`${process.env.API_URL}/api/geocode`)
  url.searchParams.set('request', 'coordsToaddr')
  url.searchParams.set('version', '1.0')
  url.searchParams.set('sourcecrs', 'epsg:4326')
  url.searchParams.set('output', 'json')
  url.searchParams.set('orders', 'legalcode')
  url.searchParams.set('coords', coords)

  const response = await fetch(url)
  const data = await response.json()
  const { results } = schema.parse(data)
  const [geo] = results
  const address = Object.values(geo.region)
    .slice(1, 4)
    .map((area) => area.name)
    .join(' ')

  return { ...geo, address }
}

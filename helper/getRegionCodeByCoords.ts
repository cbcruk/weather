import { z } from 'zod'

const BASE_URL = 'https://n.weather.naver.com'

const schema = z.object({
  regionCode: z.string(),
})

export async function getRegionCodeByCoords({
  latitude,
  longitude,
}: Partial<GeolocationCoordinates>) {
  const url = new URL(`${BASE_URL}/api/naverRgnCatForCoords`)
  url.searchParams.set('lat', `${latitude}`)
  url.searchParams.set('lat', `${longitude}`)

  const response = await fetch(url)
  const data = await response.json()

  return schema.parse(data)
}

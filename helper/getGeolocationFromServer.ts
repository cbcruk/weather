import { NextRequest } from 'next/server'

type Params = {
  geo: NextRequest['geo']
  coords: string
}

export function getGeolocationFromServer({ geo, coords }: Params) {
  if (coords) {
    const [latitude, longitude] = coords.split('_')

    return {
      latitude,
      longitude,
    }
  }

  return geo
}

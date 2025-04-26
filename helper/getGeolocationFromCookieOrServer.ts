import { DEFAULT_COORDS } from '@/constants'
import { Geo } from '@vercel/functions'

type GetGeolocationFromCookieOrServerParams = {
  serverData: Geo
  cookieData: string | undefined
}

type WithDefaultCoordsParams = Record<
  'latitude' | 'longitude',
  string | undefined
>

function withDefaultCoords({ latitude, longitude }: WithDefaultCoordsParams) {
  return {
    latitude: latitude || `${DEFAULT_COORDS.latitude}`,
    longitude: longitude || `${DEFAULT_COORDS.longitude}`,
  }
}

export function getGeolocationFromCookieOrServer({
  serverData,
  cookieData,
}: GetGeolocationFromCookieOrServerParams) {
  if (cookieData) {
    const [latitude, longitude] = cookieData.split('_')

    return withDefaultCoords({
      latitude,
      longitude,
    })
  }

  return withDefaultCoords({
    latitude: serverData?.latitude,
    longitude: serverData?.longitude,
  })
}

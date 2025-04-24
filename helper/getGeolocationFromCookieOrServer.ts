import { DEFAULT_COORDS } from '@/constants'
import { NextRequest } from 'next/server'

type GetGeolocationFromCookieOrServerParams = {
  serverData: NextRequest['geo']
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

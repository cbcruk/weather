import { NextRequest, NextResponse } from 'next/server'
import { getTimes } from 'suncalc'
import { COOKIES, DEFAULT_COORDS, THEME_STATE } from './constants'

export const config = {
  matcher: ['/', '/api/weather'],
}

function getTheme({ latitude, longitude }: Partial<GeolocationCoordinates>) {
  const now = new Date()
  const { sunrise, sunset } = getTimes(now, latitude || 0, longitude || 0)
  const theme =
    now < sunrise || now > sunset ? THEME_STATE.DARK : THEME_STATE.LIGHT

  return theme
}

type GetGeoParams = {
  geo: NextRequest['geo']
  coords: string
}

function getGeo({ geo, coords }: GetGeoParams) {
  if (coords) {
    const [latitude, longitude] = coords.split('_')

    return {
      latitude,
      longitude,
    }
  } else {
    return geo
  }
}

export function middleware({ nextUrl: url, geo, cookies }: NextRequest) {
  const coords = cookies.get(COOKIES.COORDS)?.value || ''
  const geoData = getGeo({
    geo,
    coords,
  })
  const latitude = geoData?.latitude ?? `${DEFAULT_COORDS.latitude}`
  const longitude = geoData?.longitude ?? `${DEFAULT_COORDS.longitude}`

  const theme = getTheme({
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
  })

  url.searchParams.set('latitude', latitude)
  url.searchParams.set('longitude', longitude)
  url.searchParams.set('theme', theme)

  return NextResponse.rewrite(url)
}

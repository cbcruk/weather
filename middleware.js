import { NextResponse } from 'next/server'
import { getTimes } from 'suncalc'
import { COOKIES, THEME_STATE } from './constants'

export const config = {
  matcher: ['/', '/api/weather'],
}

function getTheme({ latitude, longitude }) {
  const now = new Date()
  const { sunrise, sunset } = getTimes(now, latitude, longitude)
  const theme =
    now < sunrise || now > sunset ? THEME_STATE.DARK : THEME_STATE.LIGHT

  return theme
}

function getGeo({ geo, coords }) {
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

export function middleware({ nextUrl: url, geo, cookies }) {
  const { latitude = 37.5642135, longitude = 127.0016985 } = getGeo({
    geo,
    coords: cookies.get(COOKIES.COORDS),
  })
  const theme = getTheme({ latitude, longitude })

  url.searchParams.set('latitude', latitude)
  url.searchParams.set('longitude', longitude)
  url.searchParams.set('theme', theme)

  return NextResponse.rewrite(url)
}

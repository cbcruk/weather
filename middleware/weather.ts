import { COOKIES } from '@/constants'
import { getGeolocationFromCookieOrServer } from '@/helper/getGeolocationFromCookieOrServer'
import { getThemeBySunsetState } from '@/helper/getThemeBySunsetState'
import { NextRequest, NextResponse } from 'next/server'
import { geolocation } from '@vercel/functions'

export function weather(req: NextRequest) {
  const geo = geolocation(req)
  const { latitude, longitude } = getGeolocationFromCookieOrServer({
    serverData: {
      latitude: geo?.latitude,
      longitude: geo?.longitude,
    },
    cookieData: req.cookies.get(COOKIES.COORDS)?.value,
  })
  const theme = getThemeBySunsetState({
    coords: {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    },
  })

  req.nextUrl.searchParams.set('latitude', latitude)
  req.nextUrl.searchParams.set('longitude', longitude)
  req.nextUrl.searchParams.set('theme', theme)

  return NextResponse.rewrite(req.nextUrl)
}

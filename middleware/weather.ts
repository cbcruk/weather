import { COOKIES } from '@/constants'
import { getGeolocationFromCookieOrServer } from '@/helper/getGeolocationFromCookieOrServer'
import { getThemeByGeolocation } from '@/helper/getThemeByGeolocation'
import { NextRequest, NextResponse } from 'next/server'

export function weather({ nextUrl, cookies, geo }: NextRequest) {
  const { latitude, longitude } = getGeolocationFromCookieOrServer({
    serverData: {
      latitude: geo?.latitude,
      longitude: geo?.longitude,
    },
    cookieData: cookies.get(COOKIES.COORDS)?.value,
  })
  const theme = getThemeByGeolocation({
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
  })

  nextUrl.searchParams.set('latitude', latitude)
  nextUrl.searchParams.set('longitude', longitude)
  nextUrl.searchParams.set('theme', theme)

  return NextResponse.rewrite(nextUrl)
}

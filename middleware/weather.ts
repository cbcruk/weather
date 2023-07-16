import { COOKIES, DEFAULT_COORDS } from '@/constants'
import { getGeolocationFromServer } from '@/helper/getGeolocationFromServer'
import { getThemeByGeolocation } from '@/helper/getThemeByGeolocation'
import { NextRequest, NextResponse } from 'next/server'

export function weather({ nextUrl, cookies, geo }: NextRequest) {
  const coords = cookies.get(COOKIES.COORDS)?.value || ''
  const geoData = getGeolocationFromServer({
    geo,
    coords,
  })
  const latitude = geoData?.latitude ?? `${DEFAULT_COORDS.latitude}`
  const longitude = geoData?.longitude ?? `${DEFAULT_COORDS.longitude}`
  const theme = getThemeByGeolocation({
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
  })

  nextUrl.searchParams.set('latitude', latitude)
  nextUrl.searchParams.set('longitude', longitude)
  nextUrl.searchParams.set('theme', theme)

  return NextResponse.rewrite(nextUrl)
}

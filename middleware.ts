import { NextRequest } from 'next/server'
import { weather } from './middleware/weather'

export function middleware(request: NextRequest) {
  return weather(request)
}

export const config = {
  matcher: ['/', '/api/weather'],
}

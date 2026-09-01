import { NextRequest } from 'next/server'
import { weather } from './middleware/weather'

export function proxy(request: NextRequest) {
  return weather(request)
}

export const config = {
  matcher: ['/', '/api/weather'],
}

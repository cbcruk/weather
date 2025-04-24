import { describe, expect, it } from 'vitest'
import { getGeolocationFromCookieOrServer } from './getGeolocationFromCookieOrServer'

describe('getGeolocationFromServer', () => {
  it('geocode', () => {
    expect(
      getGeolocationFromCookieOrServer({
        serverData: {
          latitude: '127.550802',
          longitude: '37.436318',
        },
        cookieData: '127.550802_37.436318',
      })
    ).toMatchInlineSnapshot(`
      {
        "latitude": "127.550802",
        "longitude": "37.436318",
      }
    `)

    expect(
      getGeolocationFromCookieOrServer({
        serverData: {
          latitude: '127.550802',
          longitude: '37.436318',
        },
        cookieData: undefined,
      })
    ).toMatchInlineSnapshot(`
      {
        "latitude": "127.550802",
        "longitude": "37.436318",
      }
    `)
  })
})

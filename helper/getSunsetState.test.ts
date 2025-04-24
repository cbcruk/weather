import { describe, expect, it } from 'vitest'
import { getSunsetState } from './getSunsetState'

describe('getSunsetState', () => {
  it('state', () => {
    expect(
      getSunsetState({
        date: new Date(),
        coords: {
          longitude: 127.550802,
          latitude: 37.436318,
        },
      })
    ).toMatchInlineSnapshot(`"morning"`)

    expect(
      getSunsetState({
        date: new Date('2025-04-25T20:00:00'),
        coords: {
          longitude: 127.550802,
          latitude: 37.436318,
        },
      })
    ).toMatchInlineSnapshot(`"night"`)
  })
})

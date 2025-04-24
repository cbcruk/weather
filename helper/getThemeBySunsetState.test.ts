import { describe, expect, it } from 'vitest'
import { getThemeBySunsetState } from './getThemeBySunsetState'

describe('getThemeBySunsetState', () => {
  it('getThemeBySunsetState', () => {
    expect(
      getThemeBySunsetState({
        date: new Date(),
        coords: {
          longitude: 127.550802,
          latitude: 37.436318,
        },
      })
    ).toMatchInlineSnapshot(`"LIGHT"`)
  })
})

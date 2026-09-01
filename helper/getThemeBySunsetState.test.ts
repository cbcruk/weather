import { describe, expect, it } from 'vitest'
import { getThemeBySunsetState } from './getThemeBySunsetState'
import { THEME_STATE } from '@/constants'

const coords = { longitude: 127.550802, latitude: 37.436318 }

describe('getThemeBySunsetState', () => {
  it.each([
    ['낮', '2025-04-25T09:00:00+09:00', THEME_STATE.LIGHT],
    ['밤', '2025-04-25T20:00:00+09:00', THEME_STATE.DARK],
  ])('%s → %s', (_label, iso, expected) => {
    expect(getThemeBySunsetState({ date: new Date(iso), coords })).toBe(expected)
  })
})

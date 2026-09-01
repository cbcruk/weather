import { describe, expect, it } from 'vitest'
import { getSunsetState } from './getSunsetState'
import { SUNSET_STATE } from '@/constants'

// 경기도 광주 부근. 2025-04-25 서울 일몰은 19시경이다.
const coords = { longitude: 127.550802, latitude: 37.436318 }

describe('getSunsetState', () => {
  // 오프셋을 명시하지 않으면 실행 머신의 타임존에 따라 결과가 달라진다.
  it.each([
    ['일출 후 아침', '2025-04-25T09:00:00+09:00', SUNSET_STATE.morning],
    ['일몰 직전', '2025-04-25T18:30:00+09:00', SUNSET_STATE.morning],
    ['일몰 후 밤', '2025-04-25T20:00:00+09:00', SUNSET_STATE.night],
    ['자정 직전', '2025-04-25T23:59:00+09:00', SUNSET_STATE.night],
  ])('%s → %s', (_label, iso, expected) => {
    expect(getSunsetState({ date: new Date(iso), coords })).toBe(expected)
  })
})

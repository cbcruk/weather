import { describe, it, expect } from 'vitest'
import { needsCodeFix, fingerprintOf } from './errorIssuePolicy'
import type { ErrorReport } from './errorReport'

function report(overrides: Partial<ErrorReport> = {}): ErrorReport {
  return { tag: 'SchemaError', message: 'msg', source: 'server', ...overrides }
}

describe('needsCodeFix', () => {
  it.each([
    ['SchemaError', report({ tag: 'SchemaError' }), true],
    ['EmptyResultError', report({ tag: 'EmptyResultError' }), true],
    ['예상 못한 TypeError', report({ tag: 'TypeError' }), true],
    ['HttpError 404', report({ tag: 'HttpError', status: 404 }), true],
    ['HttpError 403 (차단)', report({ tag: 'HttpError', status: 403 }), true],
    ['HttpError 503 (남의 장애)', report({ tag: 'HttpError', status: 503 }), false],
    ['NetworkError', report({ tag: 'NetworkError' }), false],
  ])('%s → %s', (_label, input, expected) => {
    expect(needsCodeFix(input)).toBe(expected)
  })

  it('status 없는 HttpError는 이슈로 만들지 않는다', () => {
    expect(needsCodeFix(report({ tag: 'HttpError' }))).toBe(false)
  })
})

describe('fingerprintOf', () => {
  it('좌표·지역코드만 다른 같은 원인을 하나로 묶는다', () => {
    const a = fingerprintOf(
      report({
        message:
          'weather 응답이 스키마와 일치하지 않습니다 (https://x/api/weather/today/02610114) issues=pm10: Expected number',
      })
    )
    const b = fingerprintOf(
      report({
        message:
          'weather 응답이 스키마와 일치하지 않습니다 (https://x/api/weather/today/11710250) issues=pm10: Expected number',
      })
    )

    expect(a).toBe(b)
  })

  it('원인이 다르면 다른 지문이 된다', () => {
    const pm10 = fingerprintOf(report({ message: 'issues=pm10: Expected number' }))
    const temp = fingerprintOf(
      report({ message: 'issues=temperature: Expected number' })
    )

    expect(pm10).not.toBe(temp)
  })

  it('태그가 다르면 다른 지문이 된다', () => {
    expect(fingerprintOf(report({ tag: 'SchemaError' }))).not.toBe(
      fingerprintOf(report({ tag: 'EmptyResultError' }))
    )
  })

  it('숫자만 흔들어 이슈를 늘리려는 시도를 같은 지문으로 접는다', () => {
    const base = fingerprintOf(report({ message: 'attack 1' }))

    for (let i = 2; i < 50; i += 1) {
      expect(fingerprintOf(report({ message: `attack ${i}` }))).toBe(base)
    }
  })
})

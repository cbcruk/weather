import { describe, it, expect } from 'vitest'
import { issueKeyOf, issueTitleOf, UNEXPECTED_KEY } from './errorIssuePolicy'
import type { ErrorReport } from './errorReport'

function report(overrides: Partial<ErrorReport> = {}): ErrorReport {
  return { tag: 'SchemaError', message: 'msg', source: 'server', ...overrides }
}

describe('issueKeyOf', () => {
  it.each([
    ['SchemaError', report({ tag: 'SchemaError' }), 'SchemaError'],
    ['JsonParseError', report({ tag: 'JsonParseError' }), 'JsonParseError'],
    [
      'EmptyResultError',
      report({ tag: 'EmptyResultError' }),
      'EmptyResultError',
    ],
    ['HttpError 404', report({ tag: 'HttpError', status: 404 }), 'HttpError'],
    ['HttpError 403', report({ tag: 'HttpError', status: 403 }), 'HttpError'],
  ])('알려진 태그는 자기 이름이 키가 된다 — %s', (_label, input, expected) => {
    expect(issueKeyOf(input)).toBe(expected)
  })

  it.each([
    ['NetworkError (상대 서버 장애)', report({ tag: 'NetworkError' })],
    ['GeolocationError (사용자가 권한 거부)', report({ tag: 'GeolocationError' })],
    ['HttpError 503 (상대 서버 장애)', report({ tag: 'HttpError', status: 503 })],
    ['status 없는 HttpError', report({ tag: 'HttpError' })],
  ])('고칠 코드가 없으면 이슈를 만들지 않는다 — %s', (_label, input) => {
    expect(issueKeyOf(input)).toBeNull()
  })

  it('모르는 태그는 전부 Unexpected 하나로 모인다', () => {
    expect(issueKeyOf(report({ tag: 'TypeError' }))).toBe(UNEXPECTED_KEY)
    expect(issueKeyOf(report({ tag: 'UnknownError' }))).toBe(UNEXPECTED_KEY)
    expect(issueKeyOf(report({ tag: 'WhateverAttackerSends' }))).toBe(
      UNEXPECTED_KEY
    )
  })

  it('어떤 입력을 넣어도 만들 수 있는 이슈는 5종뿐이다', () => {
    const keys = new Set<string | null>()

    for (let i = 0; i < 500; i += 1) {
      keys.add(issueKeyOf(report({ tag: `Attack${i}`, message: `변형 ${i}` })))
      keys.add(issueKeyOf(report({ tag: 'HttpError', status: 400 + (i % 200) })))
    }

    keys.delete(null)
    expect([...keys]).toEqual([UNEXPECTED_KEY, 'HttpError'])
  })
})

describe('issueTitleOf', () => {
  it('키마다 고정된 제목을 준다', () => {
    expect(issueTitleOf('SchemaError')).toContain('[SchemaError]')
    expect(issueTitleOf(UNEXPECTED_KEY)).toContain('[Unexpected]')
  })

  it('모르는 키는 Unexpected 제목으로 떨어진다', () => {
    expect(issueTitleOf('없는키')).toBe(issueTitleOf(UNEXPECTED_KEY))
  })
})

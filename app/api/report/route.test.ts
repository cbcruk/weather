import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const sendErrorReport = vi.fn()
vi.mock('@/helper/sendErrorReport', () => ({
  sendErrorReport: (...args: unknown[]) => sendErrorReport(...args),
}))

const { POST } = await import('./route')

function post(body: unknown, ip: string) {
  return POST(
    new NextRequest('http://localhost/api/report', {
      method: 'POST',
      body: typeof body === 'string' ? body : JSON.stringify(body),
      headers: { 'x-forwarded-for': ip },
    })
  )
}

const valid = {
  tag: 'SchemaError',
  message: 'weather 응답이 스키마와 일치하지 않습니다',
  source: 'boundary',
}

beforeEach(() => {
  sendErrorReport.mockClear()
})

describe('POST /api/report', () => {
  it('올바른 리포트를 받아 전달한다', async () => {
    const res = await post(valid, '1.1.1.1')

    expect(res.status).toBe(204)
    expect(sendErrorReport).toHaveBeenCalledOnce()
    expect(sendErrorReport.mock.calls[0][0].tag).toBe('SchemaError')
  })

  it('@everyone 멘션을 무력화한다', async () => {
    await post(
      { ...valid, message: '@everyone @here 채널 전체 알림 시도' },
      '2.2.2.2'
    )

    const sent = sendErrorReport.mock.calls[0][0].message
    expect(sent).not.toMatch(/@everyone/)
    expect(sent).not.toMatch(/@here/)
  })

  it.each([
    ['JSON이 아님', 'not json'],
    ['필드 누락', { tag: 'X' }],
    ['알 수 없는 source', { ...valid, source: 'attacker' }],
    ['태그에 공백/특수문자', { ...valid, tag: '@everyone hi' }],
    ['태그가 숫자로 시작', { ...valid, tag: '1bad' }],
  ])('잘못된 입력을 거부한다 — %s', async (_label, body) => {
    const res = await post(body, '3.3.3.3')

    expect(res.status).toBe(400)
    expect(sendErrorReport).not.toHaveBeenCalled()
  })

  it('본문이 너무 크면 413', async () => {
    const res = await post(
      { ...valid, message: 'x'.repeat(5000) },
      '4.4.4.4'
    )

    expect(res.status).toBe(413)
    expect(sendErrorReport).not.toHaveBeenCalled()
  })

  it('같은 IP의 과도한 요청을 429로 막는다', async () => {
    const ip = '5.5.5.5'
    const codes: number[] = []

    for (let i = 0; i < 13; i += 1) {
      codes.push((await post(valid, ip)).status)
    }

    expect(codes.filter((c) => c === 204)).toHaveLength(10)
    expect(codes.filter((c) => c === 429)).toHaveLength(3)
  })
})

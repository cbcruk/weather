import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { sendErrorReport } from './sendErrorReport'
import * as errorIssue from './errorIssue'
import type { ErrorReport } from './errorReport'

const WEBHOOK = 'https://hooks.example/webhook'

function report(overrides: Partial<ErrorReport> = {}): ErrorReport {
  return {
    tag: 'SchemaError',
    message: 'weather 응답이 스키마와 일치하지 않습니다',
    source: 'server',
    ...overrides,
  }
}

function sentTexts(fetchMock: ReturnType<typeof vi.fn>) {
  return fetchMock.mock.calls.map(
    (call) => JSON.parse(String(call[1].body)).content as string
  )
}

let fetchMock: ReturnType<typeof vi.fn>

beforeEach(() => {
  vi.useFakeTimers()
  process.env.ERROR_WEBHOOK_URL = WEBHOOK
  fetchMock = vi.fn(async () => new Response(null, { status: 204 }))
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  delete process.env.ERROR_WEBHOOK_URL
})

describe('sendErrorReport', () => {
  it('Discord와 Slack 양쪽 키로 보낸다', async () => {
    await sendErrorReport(report({ tag: 'PayloadShape' }))

    const [url, init] = fetchMock.mock.calls[0]
    const body = JSON.parse(String(init.body))

    expect(url).toBe(WEBHOOK)
    expect(body.content).toBe(body.text)
    expect(body.content).toContain('🚨 PayloadShape · server')
  })

  it('같은 태그가 연달아 터져도 알림은 한 번만 나간다', async () => {
    for (let i = 0; i < 20; i += 1) {
      await sendErrorReport(report({ tag: 'BurstTag' }))
    }

    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('억제된 횟수를 다음 알림에 실어 보낸다', async () => {
    await sendErrorReport(report({ tag: 'CountedTag' }))
    for (let i = 0; i < 11; i += 1) {
      await sendErrorReport(report({ tag: 'CountedTag' }))
    }

    vi.advanceTimersByTime(5 * 60 * 1000 + 1)
    await sendErrorReport(report({ tag: 'CountedTag' }))

    const texts = sentTexts(fetchMock)
    expect(texts).toHaveLength(2)
    expect(texts[1]).toContain('11회 더 발생')
  })

  it('다른 태그는 따로 집계해 각각 알린다', async () => {
    await sendErrorReport(report({ tag: 'TagA' }))
    await sendErrorReport(report({ tag: 'TagB' }))
    await sendErrorReport(report({ tag: 'TagA' }))

    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('webhook 미설정이면 전송하지 않고 로그로 떨어뜨린다', async () => {
    delete process.env.ERROR_WEBHOOK_URL
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    await sendErrorReport(report({ tag: 'NoWebhook' }))

    expect(fetchMock).not.toHaveBeenCalled()
    expect(String(consoleError.mock.calls[0][0])).toContain('NoWebhook')
    consoleError.mockRestore()
  })

  it('코드 수정이 필요한 에러만 이슈로 넘긴다', async () => {
    const upsert = vi
      .spyOn(errorIssue, 'upsertErrorIssue')
      .mockResolvedValue(undefined)

    await sendErrorReport(report({ tag: 'SchemaError' }))
    expect(upsert).toHaveBeenCalledOnce()

    upsert.mockClear()
    await sendErrorReport(report({ tag: 'NetworkError' }))
    expect(upsert).not.toHaveBeenCalled()

    upsert.mockRestore()
  })

  it('이슈 전송이 실패해도 webhook은 나간다', async () => {
    const upsert = vi
      .spyOn(errorIssue, 'upsertErrorIssue')
      .mockRejectedValue(new Error('GitHub 401'))
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    await sendErrorReport(report({ tag: 'IssueSinkDown' }))

    expect(fetchMock).toHaveBeenCalledOnce()
    expect(
      consoleError.mock.calls.some((call) => String(call[0]).includes('issue'))
    ).toBe(true)

    upsert.mockRestore()
    consoleError.mockRestore()
  })

  it('webhook 전송이 실패해도 throw 하지 않는다', async () => {
    fetchMock.mockRejectedValueOnce(new Error('webhook down'))
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    await expect(
      sendErrorReport(report({ tag: 'WebhookDown' }))
    ).resolves.toBeUndefined()

    consoleError.mockRestore()
  })
})

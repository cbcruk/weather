import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { ErrorReport } from './errorReport'


const REPO = 'cbcruk/weather'

function report(overrides: Partial<ErrorReport> = {}): ErrorReport {
  return {
    tag: 'SchemaError',
    message: 'weather 응답이 스키마와 일치하지 않습니다 issues=pm10: Expected number',
    source: 'server',
    ...overrides,
  }
}

function issueWith(key: string, state: 'open' | 'closed', number = 7) {
  return { number, state, body: `<!-- error-key: ${key} -->\n본문` }
}

let fetchMock: ReturnType<typeof vi.fn>
let upsertErrorIssue: typeof import('./errorIssue').upsertErrorIssue

/** 목록 응답을 주고, 이후 호출은 전부 성공으로 받는다. */
function respondWith(list: unknown[]) {
  fetchMock.mockImplementation(async (url: string) =>
    String(url).includes('state=all')
      ? new Response(JSON.stringify(list), { status: 200 })
      : new Response('{}', { status: 201 })
  )
}

function callsTo(method: string) {
  return fetchMock.mock.calls.filter((call) => call[1]?.method === method)
}

beforeEach(async () => {
  vi.resetModules()
  process.env.ERROR_ISSUE_REPO = REPO
  process.env.ERROR_ISSUE_TOKEN = 'test-token'
  fetchMock = vi.fn()
  vi.stubGlobal('fetch', fetchMock)
  ;({ upsertErrorIssue } = await import('./errorIssue'))
})

afterEach(() => {
  vi.unstubAllGlobals()
  delete process.env.ERROR_ISSUE_REPO
  delete process.env.ERROR_ISSUE_TOKEN
})

describe('upsertErrorIssue', () => {
  it('설정이 없으면 아무 호출도 하지 않는다', async () => {
    delete process.env.ERROR_ISSUE_TOKEN

    await upsertErrorIssue(report())

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('검색 API 대신 라벨 필터 조회를 쓴다', async () => {
    respondWith([])

    await upsertErrorIssue(report())

    expect(String(fetchMock.mock.calls[0][0])).toContain(
      `/repos/${REPO}/issues?labels=auto:error`
    )
    expect(String(fetchMock.mock.calls[0][0])).not.toContain('/search/')
  })

  it('해당 태그의 이슈가 없으면 만든다', async () => {
    respondWith([])

    await upsertErrorIssue(report())

    const [created] = callsTo('POST')
    const body = JSON.parse(String(created[1].body))

    expect(body.title).toContain('[SchemaError]')
    expect(body.body).toContain('<!-- error-key: SchemaError -->')
    expect(body.labels).toContain('auto:error')
  })

  it('이슈 대상이 아닌 태그는 조회조차 하지 않는다', async () => {
    respondWith([])

    await upsertErrorIssue(report({ tag: 'GeolocationError' }))
    await upsertErrorIssue(report({ tag: 'NetworkError' }))

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('같은 태그의 다른 메시지는 같은 이슈에 코멘트로 쌓인다', async () => {
    respondWith([issueWith('SchemaError', 'open')])

    await upsertErrorIssue(report({ message: 'pm10: Expected number' }))
    await upsertErrorIssue(report({ message: 'temperature: Expected number' }))

    const posts = callsTo('POST')
    expect(posts).toHaveLength(2)
    posts.forEach((post) => {
      expect(String(post[0])).toContain('/issues/7/comments')
    })
  })

  it('열린 이슈가 있으면 새로 만들지 않고 코멘트만 단다', async () => {
    respondWith([issueWith('SchemaError', 'open')])

    await upsertErrorIssue(report())

    const posts = callsTo('POST')
    expect(posts).toHaveLength(1)
    expect(String(posts[0][0])).toContain('/issues/7/comments')
    expect(callsTo('PATCH')).toHaveLength(0)
  })

  it('닫힌 이슈가 재발하면 reopen 하고 재발을 알린다', async () => {
    respondWith([issueWith('SchemaError', 'closed')])

    await upsertErrorIssue(report())

    const [patch] = callsTo('PATCH')
    expect(String(patch[0])).toContain('/issues/7')
    expect(JSON.parse(String(patch[1].body)).state).toBe('open')

    const [comment] = callsTo('POST')
    expect(JSON.parse(String(comment[1].body)).body).toContain('재발')
  })

  it('PR은 이슈로 오인하지 않는다', async () => {
    respondWith([
      { ...issueWith('SchemaError', 'open', 99), pull_request: { url: 'x' } },
    ])

    await upsertErrorIssue(report())

    // PR을 걸렀으므로 새 이슈를 만든다.
    expect(String(callsTo('POST')[0][0])).toContain(`/repos/${REPO}/issues`)
    expect(String(callsTo('POST')[0][0])).not.toContain('/comments')
  })

  it('GitHub API 실패는 throw 해서 호출부가 로깅하도록 둔다', async () => {
    fetchMock.mockResolvedValue(new Response('bad credentials', { status: 401 }))

    await expect(upsertErrorIssue(report())).rejects.toThrow(/401/)
  })
})

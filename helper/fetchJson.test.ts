import { describe, it, expect, vi } from 'vitest'
import { Effect } from 'effect'
import { z } from 'zod'
import { fetchJson } from './fetchJson'
import { HttpError, JsonParseError, NetworkError, SchemaError } from './errors'

const schema = z.object({ name: z.string() })
const url = new URL('https://example.test/api/thing')

function run(fetchImpl: typeof fetch) {
  return Effect.runPromise(
    fetchJson({ resource: 'thing', url, schema, fetchImpl })
  )
}

describe('fetchJson', () => {
  it('성공하면 파싱된 데이터를 반환한다', async () => {
    const fetchImpl = vi.fn(async () => new Response('{"name":"weather"}'))

    await expect(run(fetchImpl)).resolves.toEqual({ name: 'weather' })
  })

  it('fetch가 실패하면 NetworkError로 감싸고 원인을 메시지에 남긴다', async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error('ECONNREFUSED')
    })

    const error = await run(fetchImpl).catch((e) => e)

    expect(error).toBeInstanceOf(NetworkError)
    expect(error._tag).toBe('NetworkError')
    expect(error.message).toContain('https://example.test/api/thing')
    expect(error.message).toContain('ECONNREFUSED')
  })

  it('2xx가 아니면 status와 본문을 담은 HttpError를 던진다', async () => {
    const fetchImpl = vi.fn(
      async () =>
        new Response('service unavailable', {
          status: 503,
          statusText: 'Service Unavailable',
        })
    )

    const error = await run(fetchImpl).catch((e) => e)

    expect(error).toBeInstanceOf(HttpError)
    expect(error.status).toBe(503)
    expect(error.message).toContain('503 Service Unavailable')
    expect(error.message).toContain('service unavailable')
  })

  it('본문이 JSON이 아니면 본문을 담은 JsonParseError를 던진다', async () => {
    const fetchImpl = vi.fn(
      async () => new Response('<!doctype html><title>502</title>')
    )

    const error = await run(fetchImpl).catch((e) => e)

    expect(error).toBeInstanceOf(JsonParseError)
    expect(error.body).toContain('<!doctype html>')
    expect(error.message).toContain('<!doctype html>')
  })

  it('스키마가 어긋나면 어긋난 경로를 담은 SchemaError를 던진다', async () => {
    const fetchImpl = vi.fn(async () => new Response('{"name":42}'))

    const error = await run(fetchImpl).catch((e) => e)

    expect(error).toBeInstanceOf(SchemaError)
    expect(error.issues).toHaveLength(1)
    expect(error.message).toContain('name')
  })

  it('runPromise는 FiberFailure가 아니라 원본 태그 에러를 reject 한다', async () => {
    const fetchImpl = vi.fn(async () => new Response('not json'))

    const error = await run(fetchImpl).catch((e) => e)

    // react-query와 ErrorBoundary가 이 값을 그대로 받는다.
    expect(error.constructor.name).toBe('JsonParseError')
    expect(error.name).toBe('JsonParseError')
    expect(String(error)).toMatch(/^JsonParseError: thing 응답이 JSON이 아닙니다/)
  })

  describe('재시도', () => {
    // 지수 백오프가 실제로 걸리므로 실 타이머로 돈다.
    it.each([
      ['NetworkError', () => Promise.reject(new Error('ECONNREFUSED'))],
      ['HttpError 503', async () => new Response('down', { status: 503 })],
      ['HttpError 429', async () => new Response('slow down', { status: 429 })],
    ])('일시적 오류는 다시 시도한다 — %s', async (_label, impl) => {
      const fetchImpl = vi.fn(impl as unknown as typeof fetch)

      await run(fetchImpl).catch(() => {})

      expect(fetchImpl).toHaveBeenCalledTimes(3)
    })

    it.each([
      ['HttpError 404', async () => new Response('nope', { status: 404 })],
      ['SchemaError', async () => new Response('{"name":42}')],
      ['JsonParseError', async () => new Response('<!doctype html>')],
    ])('결정적 실패는 즉시 포기한다 — %s', async (_label, impl) => {
      const fetchImpl = vi.fn(impl as unknown as typeof fetch)

      await run(fetchImpl).catch(() => {})

      expect(fetchImpl).toHaveBeenCalledOnce()
    })

    it('재시도 중 성공하면 그 결과를 돌려준다', async () => {
      const fetchImpl = vi
        .fn<typeof fetch>()
        .mockResolvedValueOnce(new Response('boom', { status: 503 }))
        .mockResolvedValueOnce(new Response('{"name":"weather"}'))

      await expect(run(fetchImpl)).resolves.toEqual({ name: 'weather' })
      expect(fetchImpl).toHaveBeenCalledTimes(2)
    })
  })

  it('실패 종류가 타입에 드러난다', () => {
    const program = fetchJson({ resource: 'thing', url, schema })
    type E =
      typeof program extends Effect.Effect<unknown, infer E> ? E : never
    const tags: Array<E['_tag']> = [
      'NetworkError',
      'HttpError',
      'JsonParseError',
      'SchemaError',
    ]

    expect(Effect.isEffect(program)).toBe(true)
    expect(tags).toHaveLength(4)
  })
})

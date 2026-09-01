import { describe, it, expect, vi } from 'vitest'
import { z } from 'zod'
import { fetchJson } from './fetchJson'
import {
  HttpError,
  JsonParseError,
  NetworkError,
  SchemaError,
  formatError,
} from './errors'

const schema = z.object({ name: z.string() })
const url = new URL('https://example.test/api/thing')

function params(fetchImpl: typeof fetch) {
  return { resource: 'thing', url, schema, fetchImpl }
}

describe('fetchJson', () => {
  it('성공하면 파싱된 데이터를 반환한다', async () => {
    const fetchImpl = vi.fn(async () => new Response('{"name":"weather"}'))

    await expect(fetchJson(params(fetchImpl))).resolves.toEqual({
      name: 'weather',
    })
  })

  it('fetch가 실패하면 NetworkError로 감싸고 원인을 유지한다', async () => {
    const cause = new Error('ECONNREFUSED')
    const fetchImpl = vi.fn(async () => {
      throw cause
    })

    const error = await fetchJson(params(fetchImpl)).catch((e) => e)

    expect(error).toBeInstanceOf(NetworkError)
    expect(error.tag).toBe('NetworkError')
    expect(error.cause).toBe(cause)
    expect(error.context).toMatchObject({
      resource: 'thing',
      url: url.toString(),
    })
  })

  it('2xx가 아니면 status와 본문을 담은 HttpError를 던진다', async () => {
    const fetchImpl = vi.fn(
      async () =>
        new Response('service unavailable', {
          status: 503,
          statusText: 'Service Unavailable',
        })
    )

    const error = await fetchJson(params(fetchImpl)).catch((e) => e)

    expect(error).toBeInstanceOf(HttpError)
    expect(error.status).toBe(503)
    expect(error.context).toMatchObject({
      resource: 'thing',
      status: 503,
      body: 'service unavailable',
    })
  })

  it('본문이 JSON이 아니면 본문을 담은 JsonParseError를 던진다', async () => {
    const fetchImpl = vi.fn(
      async () => new Response('<!doctype html><title>502</title>')
    )

    const error = await fetchJson(params(fetchImpl)).catch((e) => e)

    expect(error).toBeInstanceOf(JsonParseError)
    expect(error.context.body).toContain('<!doctype html>')
    expect(error.cause).toBeInstanceOf(SyntaxError)
  })

  it('스키마가 어긋나면 어긋난 경로를 담은 SchemaError를 던진다', async () => {
    const fetchImpl = vi.fn(async () => new Response('{"name":42}'))

    const error = await fetchJson(params(fetchImpl)).catch((e) => e)

    expect(error).toBeInstanceOf(SchemaError)
    expect(error.context.issueCount).toBe(1)
    expect(error.context.issues[0]).toContain('name')
  })

  it('formatError가 태그, 컨텍스트, 원인 체인을 한 번에 보여준다', async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error('socket hang up')
    })

    const error = await fetchJson(params(fetchImpl)).catch((e) => e)
    const formatted = formatError(error)

    expect(formatted).toContain('NetworkError')
    expect(formatted).toContain('example.test')
    expect(formatted).toContain('caused by')
    expect(formatted).toContain('socket hang up')
  })
})

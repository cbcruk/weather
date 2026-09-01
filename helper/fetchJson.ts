import { Effect } from 'effect'
import { z } from 'zod'
import { HttpError, JsonParseError, NetworkError, SchemaError } from './errors'

type FetchJsonParams<Schema extends z.ZodTypeAny> = {
  /** 로그에 남길 요청 이름. 어떤 API가 실패했는지 구분하는 용도. */
  resource: string
  url: URL
  schema: Schema
  headers?: HeadersInit
  fetchImpl?: typeof fetch
}

/**
 * fetch → JSON 파싱 → 스키마 검증을 한 곳에서 처리한다.
 * 각 단계의 실패가 Effect의 에러 채널에 실려, 호출부 타입에 그대로 드러난다.
 *
 * Effect<A, NetworkError | HttpError | JsonParseError | SchemaError>
 */
export const fetchJson = <Schema extends z.ZodTypeAny>({
  resource,
  url,
  schema,
  headers,
  fetchImpl = fetch,
}: FetchJsonParams<Schema>) =>
  Effect.gen(function* () {
    const href = url.toString()

    const response = yield* Effect.tryPromise({
      try: () => fetchImpl(url, { headers }),
      catch: (cause) => new NetworkError({ resource, url: href, cause }),
    })

    if (!response.ok) {
      const body = yield* Effect.promise(() => response.text().catch(() => ''))

      return yield* new HttpError({
        resource,
        url: href,
        status: response.status,
        statusText: response.statusText,
        body,
      })
    }

    // json() 대신 text()를 거치는 이유: 파싱에 실패했을 때 실제 본문을 에러에 담기 위해서다.
    const body = yield* Effect.tryPromise({
      try: () => response.text(),
      catch: (cause) => new NetworkError({ resource, url: href, cause }),
    })

    const data = yield* Effect.try({
      try: () => JSON.parse(body) as unknown,
      catch: (cause) => new JsonParseError({ resource, url: href, body, cause }),
    })

    const parsed = schema.safeParse(data)

    if (!parsed.success) {
      return yield* new SchemaError({
        resource,
        url: href,
        issues: parsed.error.issues.map(
          (issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`
        ),
      })
    }

    return parsed.data as z.infer<Schema>
  })

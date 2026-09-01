import { Effect, Schedule } from 'effect'
import { z } from 'zod'
import { HttpError, JsonParseError, NetworkError, SchemaError } from './errors'

type FetchError = NetworkError | HttpError | JsonParseError | SchemaError

/**
 * 다시 시도하면 성공할 수 있는 실패인지 판단한다.
 *
 * - NetworkError: 연결 실패. 대표적인 일시적 오류다.
 * - HttpError 5xx / 429: 상대 서버가 잠깐 못 받는 상태다.
 *
 * 나머지는 재시도해도 같은 결과다. SchemaError 는 응답 구조가 바뀐 것이고
 * 4xx 는 차단이나 경로 변경이라 몇 초 안에 저절로 고쳐지지 않는다.
 * 그걸 재시도하면 사용자에게 대기 시간만 늘려 준다.
 *
 * JsonParseError 도 재시도하지 않는다. 상대가 200으로 JSON이 아닌 본문을
 * 준 것이라, 보통 차단 페이지처럼 다시 요청해도 같은 것이 온다.
 * (2xx가 아닌 에러 페이지였다면 그 전에 HttpError 로 걸린다.)
 */
function isTransient(error: FetchError) {
  if (error._tag === 'NetworkError') {
    return true
  }

  return (
    error._tag === 'HttpError' && (error.status >= 500 || error.status === 429)
  )
}

/**
 * 200ms에서 시작해 지수적으로 늘리고 지터를 섞는다.
 * 지터가 없으면 동시에 실패한 요청들이 같은 시점에 몰려 재시도한다.
 */
const RETRY_SCHEDULE = Schedule.jittered(Schedule.exponential('200 millis'))
const RETRY_TIMES = 2

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
  }).pipe(
    Effect.retry({
      while: isTransient,
      times: RETRY_TIMES,
      schedule: RETRY_SCHEDULE,
    })
  )

export type ErrorContext = Record<string, unknown>

export type AppErrorTag =
  | 'NetworkError'
  | 'HttpError'
  | 'JsonParseError'
  | 'SchemaError'
  | 'EmptyResultError'
  | 'GeolocationError'

type AppErrorOptions = {
  cause?: unknown
  context?: ErrorContext
}

/**
 * 모든 도메인 에러의 기반 클래스.
 *
 * - `tag`로 어떤 종류의 실패인지 구분한다. `name`에도 같은 값을 넣어 스택 첫 줄에서 바로 보인다.
 * - `context`에 어떤 요청이 왜 실패했는지 추적에 필요한 값을 담는다.
 * - `cause`로 원본 에러를 유지해 체인을 잃지 않는다.
 */
export class AppError extends Error {
  readonly tag: AppErrorTag
  readonly context: ErrorContext

  constructor(tag: AppErrorTag, message: string, options: AppErrorOptions = {}) {
    super(message, { cause: options.cause })
    this.name = tag
    this.tag = tag
    this.context = options.context ?? {}
  }
}

const MAX_BODY_LENGTH = 500

function truncate(body: string) {
  return body.length > MAX_BODY_LENGTH
    ? `${body.slice(0, MAX_BODY_LENGTH)}…(${body.length}자)`
    : body
}

type RequestInfo = {
  resource: string
  url: URL
}

/** fetch 자체가 실패한 경우 (DNS, 타임아웃, 연결 끊김 등) */
export class NetworkError extends AppError {
  declare readonly tag: 'NetworkError'

  constructor({ resource, url, cause }: RequestInfo & { cause: unknown }) {
    super('NetworkError', `${resource} 요청에 실패했습니다`, {
      cause,
      context: { resource, url: url.toString() },
    })
  }
}

/** 응답은 왔지만 2xx가 아닌 경우 */
export class HttpError extends AppError {
  declare readonly tag: 'HttpError'
  readonly status: number

  constructor({
    resource,
    url,
    status,
    statusText,
    body,
  }: RequestInfo & { status: number; statusText: string; body: string }) {
    super(
      'HttpError',
      `${resource} 요청이 ${status} ${statusText} 로 응답했습니다`,
      {
        context: {
          resource,
          url: url.toString(),
          status,
          body: truncate(body),
        },
      }
    )
    this.status = status
  }
}

/** 응답 본문이 JSON이 아닌 경우 (에러 페이지 HTML 등) */
export class JsonParseError extends AppError {
  declare readonly tag: 'JsonParseError'

  constructor({
    resource,
    url,
    body,
    cause,
  }: RequestInfo & { body: string; cause: unknown }) {
    super('JsonParseError', `${resource} 응답이 JSON이 아닙니다`, {
      cause,
      context: { resource, url: url.toString(), body: truncate(body) },
    })
  }
}

type SchemaIssue = {
  path: Array<string | number>
  message: string
}

const MAX_ISSUES = 5

/** JSON이지만 기대한 스키마와 다른 경우 */
export class SchemaError extends AppError {
  declare readonly tag: 'SchemaError'

  constructor({
    resource,
    url,
    issues,
  }: RequestInfo & { issues: ReadonlyArray<SchemaIssue> }) {
    const summary = issues
      .slice(0, MAX_ISSUES)
      .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)

    super('SchemaError', `${resource} 응답이 스키마와 일치하지 않습니다`, {
      context: {
        resource,
        url: url.toString(),
        issueCount: issues.length,
        issues: summary,
      },
    })
  }
}

/** 요청은 성공했지만 사용할 수 있는 결과가 비어 있는 경우 */
export class EmptyResultError extends AppError {
  declare readonly tag: 'EmptyResultError'

  constructor({
    resource,
    url,
    context,
  }: RequestInfo & { context?: ErrorContext }) {
    super('EmptyResultError', `${resource} 응답에 결과가 없습니다`, {
      context: { resource, url: url.toString(), ...context },
    })
  }
}

/** 브라우저 위치 정보 조회 실패 */
export class GeolocationError extends AppError {
  declare readonly tag: 'GeolocationError'

  constructor({
    reason,
    code,
    cause,
  }: {
    reason: string
    code?: number
    cause?: unknown
  }) {
    super('GeolocationError', `위치 정보를 가져오지 못했습니다: ${reason}`, {
      cause,
      context: { reason, code },
    })
  }
}

function stringifyContext(context: ErrorContext) {
  if (Object.keys(context).length === 0) {
    return ''
  }

  try {
    return ` ${JSON.stringify(context)}`
  } catch {
    return ' [context 직렬화 실패]'
  }
}

const MAX_CAUSE_DEPTH = 5

/**
 * 에러를 cause 체인까지 한 줄씩 펼쳐 로깅용 문자열로 만든다.
 * 로그만 보고 "어느 요청이 어떤 이유로 죽었는지" 알 수 있게 하는 것이 목적이다.
 */
export function formatError(error: unknown): string {
  const lines: string[] = []
  let current: unknown = error

  for (let depth = 0; depth < MAX_CAUSE_DEPTH && current != null; depth += 1) {
    if (current instanceof AppError) {
      lines.push(
        `${current.tag}: ${current.message}${stringifyContext(current.context)}`
      )
    } else if (current instanceof Error) {
      lines.push(`${current.name}: ${current.message}`)
    } else {
      lines.push(String(current))
      break
    }

    current = (current as Error).cause
  }

  return lines.join('\n  ↳ caused by ')
}

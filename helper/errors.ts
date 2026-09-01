import { Data } from 'effect'

const MAX_BODY_LENGTH = 500

function truncate(body: string) {
  return body.length > MAX_BODY_LENGTH
    ? `${body.slice(0, MAX_BODY_LENGTH)}…(${body.length}자)`
    : body
}

function describeCause(cause: unknown) {
  return cause instanceof Error ? `${cause.name}: ${cause.message}` : String(cause)
}

/**
 * Data.TaggedError는 name을 태그로 설정하고 Error를 상속하므로,
 * message getter만 채우면 String(error)가 "Tag: 무엇이 왜 실패했는지"로 출력된다.
 * Effect의 에러 채널에도 그대로 실려 컴파일러가 실패 종류를 열거해준다.
 */

/** fetch 자체가 실패한 경우 (DNS, 타임아웃, 연결 끊김 등) */
export class NetworkError extends Data.TaggedError('NetworkError')<{
  resource: string
  url: string
  cause: unknown
}> {
  get message() {
    return `${this.resource} 요청에 실패했습니다 (${this.url}) ← ${describeCause(this.cause)}`
  }
}

/** 응답은 왔지만 2xx가 아닌 경우 */
export class HttpError extends Data.TaggedError('HttpError')<{
  resource: string
  url: string
  status: number
  statusText: string
  body: string
}> {
  get message() {
    return `${this.resource} 요청이 ${this.status} ${this.statusText} 로 응답했습니다 (${this.url}) body=${truncate(this.body)}`
  }
}

/** 응답 본문이 JSON이 아닌 경우 (에러 페이지 HTML 등) */
export class JsonParseError extends Data.TaggedError('JsonParseError')<{
  resource: string
  url: string
  body: string
  cause: unknown
}> {
  get message() {
    return `${this.resource} 응답이 JSON이 아닙니다 (${this.url}) body=${truncate(this.body)} ← ${describeCause(this.cause)}`
  }
}

/** JSON이지만 기대한 스키마와 다른 경우 */
export class SchemaError extends Data.TaggedError('SchemaError')<{
  resource: string
  url: string
  issues: ReadonlyArray<string>
}> {
  get message() {
    return `${this.resource} 응답이 스키마와 일치하지 않습니다 (${this.url}) issues=${this.issues.join(' / ')}`
  }
}

/** 요청은 성공했지만 사용할 수 있는 결과가 비어 있는 경우 */
export class EmptyResultError extends Data.TaggedError('EmptyResultError')<{
  resource: string
  url: string
  detail: string
}> {
  get message() {
    return `${this.resource} 응답에 결과가 없습니다 (${this.url}) ${this.detail}`
  }
}

/** 브라우저 위치 정보 조회 실패 */
export class GeolocationError extends Data.TaggedError('GeolocationError')<{
  reason: string
  code?: number
  cause?: unknown
}> {
  get message() {
    const detail = this.cause ? ` ← ${describeCause(this.cause)}` : ''

    return `위치 정보를 가져오지 못했습니다: ${this.reason}${detail}`
  }
}

import { ErrorReport } from './errorReport'

export const UNEXPECTED_KEY = 'Unexpected'

/**
 * 이슈로 묶는 단위이자 제목이다. 태그 하나에 이슈 하나이고,
 * 개별 발생은 그 이슈의 코멘트로 쌓인다.
 */
const ISSUE_TITLE: Record<string, string> = {
  SchemaError: '[SchemaError] 응답이 기대한 스키마와 다릅니다',
  JsonParseError: '[JsonParseError] 응답이 JSON이 아닙니다',
  EmptyResultError: '[EmptyResultError] 응답에 결과가 없습니다',
  HttpError: '[HttpError] 4xx 응답을 받았습니다',
  [UNEXPECTED_KEY]: '[Unexpected] 예상하지 못한 에러',
}

/**
 * 이슈를 만들지 않는 태그.
 *
 * - NetworkError: 상대 서버가 죽은 것이라 우리가 닫을 방법이 없다.
 * - GeolocationError: 사용자가 위치 권한을 거부한 정상 동작이다.
 *   장애가 아니므로 이슈로 만들면 권한 거부마다 알림이 쌓인다.
 *
 * 둘 다 webhook 알림은 그대로 나간다.
 */
const NO_ISSUE = new Set(['NetworkError', 'GeolocationError'])

/**
 * 리포트를 이슈 키로 옮긴다. null이면 이슈를 만들지 않는다.
 *
 * 알려진 태그는 자기 이름이 키가 되고, 모르는 태그는 전부 Unexpected 하나로
 * 모인다. 그래서 이 앱이 만들 수 있는 이슈는 위 목록의 5개가 전부다.
 *
 * 이것이 곧 스팸 방어이기도 하다. /api/report 는 공개 엔드포인트라 누구나
 * 리포트를 보낼 수 있는데, 이슈 개수가 태그 수로 묶여 있으면 어떤 입력을
 * 넣어도 새 이슈가 늘어나지 않는다.
 */
export function issueKeyOf(report: ErrorReport): string | null {
  if (NO_ISSUE.has(report.tag)) {
    return null
  }

  if (report.tag === 'HttpError') {
    // 5xx는 상대 서버 장애, 4xx는 차단·인증·경로 변경이라 대응이 필요하다.
    return report.status !== undefined && report.status < 500
      ? 'HttpError'
      : null
  }

  return report.tag in ISSUE_TITLE ? report.tag : UNEXPECTED_KEY
}

export function issueTitleOf(key: string) {
  return ISSUE_TITLE[key] ?? ISSUE_TITLE[UNEXPECTED_KEY]
}

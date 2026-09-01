import { ErrorReport } from './errorReport'

/**
 * 지문 전용 해시(cyrb53).
 *
 * Node의 createHash는 Edge Runtime에서 쓸 수 없고, 이 값은 같은 장애를
 * 한 이슈로 묶기 위한 그룹핑 키일 뿐 암호학적 성질이 필요 없다.
 * 의존성 없이 동기로 동작하고 두 런타임 모두에서 같은 값을 낸다.
 */
function hash53(text: string) {
  let h1 = 0xdeadbeef
  let h2 = 0x41c6ce57

  for (let i = 0; i < text.length; i += 1) {
    const ch = text.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }

  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909)

  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36)
}

/**
 * 이슈로 만들 가치가 있는 에러인지 판단한다.
 *
 * 기준은 "고칠 코드가 우리 쪽에 있는가"다.
 * 남의 서버가 죽은 것(NetworkError, 5xx)은 이슈를 만들어도 닫을 방법이 없고,
 * 이슈 목록만 어지럽힌다. 알림은 webhook으로 이미 간다.
 *
 * 목록에 없는 태그는 이슈로 만든다. 예상하지 못한 에러야말로 추적이 필요하다.
 */
export function needsCodeFix(report: ErrorReport) {
  if (report.tag === 'NetworkError') {
    return false
  }

  if (report.tag === 'HttpError') {
    // 5xx는 상대 서버 장애, 4xx는 차단·인증·경로 변경이라 대응이 필요하다.
    return report.status !== undefined && report.status < 500
  }

  return true
}

/**
 * 같은 장애를 하나의 이슈로 묶기 위한 지문.
 *
 * 메시지에는 좌표, 지역 코드, 응답 본문처럼 매번 달라지는 값이 섞여 있다.
 * 숫자와 URL을 걷어내고 남는 구조만으로 해시해야 같은 원인이 같은 이슈로 모인다.
 *
 * 동시에 이것은 스팸 방어이기도 하다. /api/report 는 공개 엔드포인트라
 * 메시지를 조금씩 바꿔 이슈를 대량 생성하려는 시도가 가능한데,
 * 정규화가 그런 변형을 같은 지문으로 접는다.
 */
export function fingerprintOf(report: ErrorReport) {
  const normalized = report.message
    .replace(/https?:\/\/\S+/g, '<url>')
    .replace(/\d+/g, '<n>')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 300)

  return hash53(`${report.tag}\n${normalized}`)
}

import 'server-only'
import { waitUntil } from '@vercel/functions'

/**
 * 응답을 막지 않고 뒤에서 마저 실행한다.
 *
 * 에러 리포트는 webhook 1회 + GitHub API 최대 3회라 응답 경로에 두면
 * 장애 상황에서 오히려 사용자 대기가 늘어난다. 서버리스는 응답 후
 * 실행이 보장되지 않으므로 Vercel의 waitUntil로 수명을 연장한다.
 */
export function afterResponse(work: Promise<unknown>) {
  // 에러 처리 경로라 여기서 다시 터지면 원인을 통째로 잃는다.
  const safe = Promise.resolve(work).catch((cause) => {
    console.error('[afterResponse] 백그라운드 작업 실패', cause)
  })

  waitUntil(safe)
}

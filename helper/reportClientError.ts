'use client'

import { ErrorReport, toErrorReport } from './errorReport'

const ENDPOINT = '/api/report'

/**
 * 클라이언트에서만 관측되는 에러를 서버로 보낸다.
 * 지금까지 이 경로의 에러는 사용자 브라우저 콘솔에만 남아 아무도 보지 못했다.
 *
 * 리포트 실패가 앱을 더 망가뜨리면 안 되므로 절대 throw 하지 않는다.
 */
export function reportClientError(
  error: unknown,
  source: ErrorReport['source'],
  extra: Pick<ErrorReport, 'digest'> = {}
) {
  try {
    const report = toErrorReport(error, source, {
      ...extra,
      path: window.location.pathname,
    })
    const body = JSON.stringify(report)

    // 페이지 이탈 중에도 살아남도록 sendBeacon을 우선 사용한다.
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        ENDPOINT,
        new Blob([body], { type: 'application/json' })
      )
      return
    }

    void fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {})
  } catch {
    // 리포트는 best-effort다.
  }
}

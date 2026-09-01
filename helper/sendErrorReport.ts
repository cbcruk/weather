import 'server-only'
import { ErrorReport } from './errorReport'

const WINDOW_MS = 5 * 60 * 1000

/**
 * 같은 종류의 에러가 연달아 터질 때 알림이 도배되는 것을 막는다.
 *
 * 서버리스라 인스턴스마다 상태가 따로 있고 오래 살지도 않는다.
 * 완전한 중복 제거가 아니라 "한 인스턴스에서 터지는 버스트를 접는" 수준이며,
 * 억제된 횟수는 다음 알림에 함께 실어 보낸다.
 */
const suppressedUntil = new Map<string, { until: number; count: number }>()

function format(report: ErrorReport, repeated: number) {
  const lines = [
    `🚨 ${report.tag} · ${report.source}`,
    report.message,
  ]

  if (report.path) {
    lines.push(`path: ${report.path}`)
  }

  if (report.digest) {
    lines.push(`digest: ${report.digest}`)
  }

  if (repeated > 0) {
    lines.push(`직전 ${WINDOW_MS / 60000}분간 ${repeated}회 더 발생 (알림 억제됨)`)
  }

  return lines.join('\n')
}

export async function sendErrorReport(report: ErrorReport): Promise<void> {
  const key = `${report.source}:${report.tag}`
  const now = Date.now()
  const entry = suppressedUntil.get(key)

  if (entry && entry.until > now) {
    entry.count += 1
    return
  }

  suppressedUntil.set(key, { until: now + WINDOW_MS, count: 0 })

  const text = format(report, entry?.count ?? 0)
  const webhookUrl = process.env.ERROR_WEBHOOK_URL

  // webhook이 설정되지 않은 환경(로컬, 미설정 배포)에서는 로그로 떨어뜨린다.
  if (!webhookUrl) {
    console.error(text)
    return
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Discord는 content, Slack은 text를 읽는다. 둘 다 실어 보내면
      // 어느 쪽 webhook이든 그대로 동작한다.
      body: JSON.stringify({ content: text, text }),
    })
  } catch (cause) {
    console.error('[sendErrorReport] webhook 전송 실패', cause, '\n', text)
  }
}

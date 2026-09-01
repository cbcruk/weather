import { NextRequest, NextResponse } from 'next/server'
import { errorReportSchema } from '@/helper/errorReport'
import { sendErrorReport } from '@/helper/sendErrorReport'
import { afterResponse } from '@/helper/afterResponse'

const MAX_BODY_BYTES = 4_000
const RATE_LIMIT = { max: 10, windowMs: 60_000 }
const TAG_PATTERN = /^[A-Za-z][A-Za-z0-9_]*$/

const hits = new Map<string, { until: number; count: number }>()

function isRateLimited(ip: string) {
  const now = Date.now()
  const entry = hits.get(ip)

  if (!entry || entry.until <= now) {
    hits.set(ip, { until: now + RATE_LIMIT.windowMs, count: 1 })
    return false
  }

  entry.count += 1

  return entry.count > RATE_LIMIT.max
}

/**
 * webhook 메시지에 그대로 실리는 값이므로 멘션을 무력화한다.
 * @everyone / @here 는 채널 전체에 알림을 보내므로 공개 엔드포인트에서
 * 가장 먼저 막아야 할 주입 경로다.
 */
function neutralizeMentions(text: string) {
  return text.replace(/@/g, '@​')
}

/**
 * 클라이언트에서만 관측되는 에러(ErrorBoundary, 라우트 에러 화면)를 받는다.
 * 공개 엔드포인트라 입력을 신뢰하지 않는다.
 */
export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'

  if (isRateLimited(ip)) {
    return new NextResponse(null, { status: 429 })
  }

  const raw = await request.text()

  if (raw.length > MAX_BODY_BYTES) {
    return new NextResponse(null, { status: 413 })
  }

  let parsed
  try {
    parsed = errorReportSchema.safeParse(JSON.parse(raw))
  } catch {
    return new NextResponse(null, { status: 400 })
  }

  if (!parsed.success || !TAG_PATTERN.test(parsed.data.tag)) {
    return new NextResponse(null, { status: 400 })
  }

  afterResponse(
    sendErrorReport({
      ...parsed.data,
      message: neutralizeMentions(parsed.data.message),
      path: parsed.data.path && neutralizeMentions(parsed.data.path),
    })
  )

  return new NextResponse(null, { status: 204 })
}

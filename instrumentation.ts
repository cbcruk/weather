import type { Instrumentation } from 'next'
import { toErrorReport } from '@/helper/errorReport'
import { sendErrorReport } from '@/helper/sendErrorReport'

/**
 * Next의 공식 서버 에러 훅. 서버 컴포넌트 렌더, 라우트 핸들러, 프리페치
 * 등에서 발생한 에러가 여기로 모인다. 기존에는 이 경로가 Vercel 함수
 * 로그로만 흘러가 아무도 보지 않았다.
 */
export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context
) => {
  await sendErrorReport(
    toErrorReport(error, 'server', {
      path: `${request.method} ${request.path} (${context.routerKind}/${context.routeType})`,
    })
  )
}

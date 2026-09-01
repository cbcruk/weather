'use client'

import { ErrorInfo, PropsWithChildren } from 'react'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { reportClientError } from '@/helper/reportClientError'

function logError(error: unknown, info: ErrorInfo) {
  console.error(`[AppErrorBoundary]\n${String(error)}`, info.componentStack)
  reportClientError(error, 'boundary')
}

function AppErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-4 p-8 text-center"
    >
      <p className="font-semibold">날씨 정보를 불러오지 못했습니다.</p>
      {process.env.NODE_ENV === 'development' && (
        <pre className="max-w-full overflow-x-auto whitespace-pre-wrap text-left text-xs opacity-70">
          {String(error)}
        </pre>
      )}
      <button
        type="button"
        onClick={resetErrorBoundary}
        className="cursor-pointer rounded border px-4 py-2 text-sm"
      >
        다시 시도
      </button>
    </div>
  )
}

/**
 * react-query의 reset과 묶인 에러 경계.
 * useSuspenseQuery가 던진 에러를 여기서 받아 로그를 남기고, 재시도 시 쿼리를 다시 실행한다.
 */
export function AppErrorBoundary({ children }: PropsWithChildren) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          onError={logError}
          FallbackComponent={AppErrorFallback}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}

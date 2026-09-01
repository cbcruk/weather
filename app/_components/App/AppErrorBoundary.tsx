'use client'

import React from 'react'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { formatError } from '@/helper/errors'

type FallbackProps = {
  error: Error
  reset: () => void
}

type ErrorBoundaryProps = React.PropsWithChildren<{
  onReset: () => void
  fallback: React.ComponentType<FallbackProps>
}>

type ErrorBoundaryState = {
  error: Error | null
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      `[AppErrorBoundary]\n${formatError(error)}`,
      errorInfo.componentStack
    )
  }

  reset = () => {
    this.props.onReset()
    this.setState({ error: null })
  }

  render() {
    const { error } = this.state

    if (error) {
      const Fallback = this.props.fallback

      return <Fallback error={error} reset={this.reset} />
    }

    return this.props.children
  }
}

function AppErrorFallback({ error, reset }: FallbackProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-4 p-8 text-center"
    >
      <p className="font-semibold">날씨 정보를 불러오지 못했습니다.</p>
      {process.env.NODE_ENV === 'development' && (
        <pre className="max-w-full overflow-x-auto whitespace-pre-wrap text-left text-xs opacity-70">
          {formatError(error)}
        </pre>
      )}
      <button
        type="button"
        onClick={reset}
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
export function AppErrorBoundary({ children }: React.PropsWithChildren) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} fallback={AppErrorFallback}>
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}


'use client'

import { useEffect } from 'react'

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * AppErrorBoundary가 잡지 못한 렌더 에러(서버 컴포넌트 포함)를 받는 라우트 단위 경계.
 */
export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error(
      `[app/error]${error.digest ? ` digest=${error.digest}` : ''}\n${String(error)}`
    )
  }, [error])

  return (
    <main
      role="alert"
      className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center"
    >
      <p className="font-semibold">문제가 발생했습니다.</p>
      {process.env.NODE_ENV === 'development' && (
        <pre className="max-w-full overflow-x-auto whitespace-pre-wrap text-left text-xs opacity-70">
          {String(error)}
        </pre>
      )}
      <button
        type="button"
        onClick={reset}
        className="cursor-pointer rounded border px-4 py-2 text-sm"
      >
        다시 시도
      </button>
    </main>
  )
}

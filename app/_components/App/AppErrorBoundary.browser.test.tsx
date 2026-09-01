import { describe, it, expect, vi, afterEach } from 'vitest'
import { render } from 'vitest-browser-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppErrorBoundary } from './AppErrorBoundary'
import { HttpError } from '@/helper/errors'

const error = new HttpError({
  resource: 'weather',
  url: new URL('https://weather.example/api/weather/today/02610114'),
  status: 503,
  statusText: 'Service Unavailable',
  body: 'upstream down',
})

function Boom({ shouldThrow }: { shouldThrow: () => boolean }) {
  if (shouldThrow()) {
    throw error
  }

  return <p>날씨</p>
}

function renderWithBoundary(shouldThrow: () => boolean) {
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <AppErrorBoundary>
        <Boom shouldThrow={shouldThrow} />
      </AppErrorBoundary>
    </QueryClientProvider>
  )
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('AppErrorBoundary', () => {
  it('자식이 던진 에러를 잡아 폴백을 보여준다', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const screen = renderWithBoundary(() => true)

    await expect
      .element(screen.getByText('날씨 정보를 불러오지 못했습니다.'))
      .toBeVisible()
  })

  it('formatError로 태그와 컨텍스트를 로깅한다', async () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    const screen = renderWithBoundary(() => true)

    await expect.element(screen.getByRole('alert')).toBeVisible()

    const logged = consoleError.mock.calls
      .map((call) => String(call[0]))
      .join('\n')

    expect(logged).toContain('[AppErrorBoundary]')
    expect(logged).toContain('HttpError')
    expect(logged).toContain('"status":503')
  })

  it('다시 시도를 누르면 자식을 다시 렌더한다', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    let shouldThrow = true
    const screen = renderWithBoundary(() => shouldThrow)

    await expect.element(screen.getByRole('alert')).toBeVisible()

    shouldThrow = false
    await screen.getByRole('button', { name: '다시 시도' }).click()

    await expect.element(screen.getByText('날씨')).toBeVisible()
  })
})

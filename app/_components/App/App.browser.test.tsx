import { describe, it, expect } from 'vitest'
import { useState, use } from 'react'
import { render } from 'vitest-browser-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App } from './App'

function Slow({ promise }: { promise: Promise<string> }) {
  const text = use(promise)

  return <p>{text}</p>
}

/**
 * ViewTransition 이 감싸는 공개는 최초 렌더가 아니라 마운트 이후에 일어난다.
 * 그래서 자식을 버튼으로 뒤늦게 붙여 실제 공개 경로를 그대로 밟는다.
 */
function Harness({ promise }: { promise: Promise<string> }) {
  const [shown, setShown] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setShown(true)}>
        불러오기
      </button>
      <App>{shown ? <Slow promise={promise} /> : null}</App>
    </>
  )
}

/**
 * App 은 자식을 ViewTransition 으로 감싼다. 브라우저 View Transitions API 를
 * 쓰므로 jsdom 이 아니라 실제 브라우저에서 공개 경로를 확인한다.
 */
describe('App', () => {
  it('suspend 된 자식이 준비되면 화면에 드러낸다', async () => {
    let resolve: (value: string) => void = () => {}
    const promise = new Promise<string>((r) => {
      resolve = r
    })

    const screen = render(
      <QueryClientProvider client={new QueryClient()}>
        <Harness promise={promise} />
      </QueryClientProvider>
    )

    await screen.getByRole('button', { name: '불러오기' }).click()

    resolve('날씨')

    await expect.element(screen.getByText('날씨')).toBeVisible()
  })
})

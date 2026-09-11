import { describe, it, expect, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { WeatherGeolocationButton } from './WeatherGeolocationButton'
import { WeatherGeolocationNotice } from './WeatherGeolocationNotice'
import { GeolocationError } from '@/helper/errors'

describe('WeatherGeolocationButton', () => {
  it('기다리는 동안 다시 누를 수 없고 무엇을 하는 중인지 이름으로 알린다', async () => {
    const onRefresh = vi.fn()
    const screen = render(
      <WeatherGeolocationButton isPending onRefresh={onRefresh} />
    )
    const button = screen.getByRole('button', { name: '현재 위치를 확인하는 중' })

    await expect.element(button).toBeDisabled()
    expect(onRefresh).not.toHaveBeenCalled()
  })

  it('누르면 갱신을 요청한다', async () => {
    const onRefresh = vi.fn()
    const screen = render(
      <WeatherGeolocationButton isPending={false} onRefresh={onRefresh} />
    )

    await screen.getByRole('button', { name: '현재 위치로 다시 불러오기' }).click()

    expect(onRefresh).toHaveBeenCalledTimes(1)
  })
})

describe('WeatherGeolocationNotice', () => {
  it('기다리는 중임을 알린다', async () => {
    const screen = render(
      <WeatherGeolocationNotice isPending error={null} />
    )

    await expect.element(screen.getByRole('status')).toHaveTextContent(
      '현재 위치를 확인하고 있어요'
    )
  })

  it('권한이 거부되면 무엇을 해야 하는지 알린다', async () => {
    const screen = render(
      <WeatherGeolocationNotice
        isPending={false}
        error={new GeolocationError({ reason: '위치 권한이 거부되었습니다', code: 1 })}
      />
    )

    await expect.element(screen.getByRole('alert')).toHaveTextContent(
      '위치 권한이 거부되었습니다. 브라우저에서 위치 권한을 허용한 뒤 다시 눌러주세요'
    )
  })

  it('성공했을 때는 아무것도 남기지 않는다', () => {
    const screen = render(
      <WeatherGeolocationNotice isPending={false} error={null} />
    )

    expect(screen.container.textContent).toBe('')
  })
})

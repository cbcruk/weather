import { COOKIES } from '@/constants'
import { GeolocationError } from '@/helper/errors'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import Cookies from 'js-cookie'

type Coords = Record<'latitude' | 'longitude', number>

const GEOLOCATION_TIMEOUT = 10_000

const GEOLOCATION_ERROR_REASON: Record<number, string> = {
  1: '위치 권한이 거부되었습니다',
  2: '위치를 확인할 수 없습니다',
  3: `응답이 ${GEOLOCATION_TIMEOUT / 1000}초 안에 오지 않았습니다`,
}

function getGeolocationFromClient(): Promise<Coords> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new GeolocationError({ reason: '이 브라우저는 위치정보를 지원하지 않습니다' }))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      // error 콜백이 없으면 권한 거부 시 Promise가 영원히 pending 상태로 남는다.
      (error) => {
        reject(
          new GeolocationError({
            reason: GEOLOCATION_ERROR_REASON[error.code] ?? error.message,
            code: error.code,
            cause: error,
          })
        )
      },
      { timeout: GEOLOCATION_TIMEOUT }
    )
  })
}

export function useGeolocationMutation() {
  const queryClient = useQueryClient()
  const router = useRouter()
  // router.refresh()는 await할 수 없다. transition으로 감싸면 새 좌표의 화면이
  // 실제로 붙을 때까지 isPending이 유지되고, 그래서 버튼이 먼저 멀쩡한 얼굴로
  // 돌아가 아무 일도 없었던 것처럼 보이는 일이 없다.
  const [isRefreshing, startTransition] = useTransition()
  const mutation = useMutation({
    mutationFn: () => getGeolocationFromClient(),
    // onSuccess가 돌려준 Promise가 끝날 때까지 isPending이 유지된다.
    async onSuccess({ latitude, longitude }) {
      Cookies.set(COOKIES.COORDS, [latitude, longitude].join('_'), {
        expires: 365,
      })

      // 좌표는 미들웨어가 쿠키를 읽어 searchParams에 넣고 그 값이 쿼리 키가 된다.
      // 쿠키만 바꾸고 무효화하면 예전 좌표로 다시 받으므로 화면이 그대로다.
      startTransition(() => {
        router.refresh()
      })

      // 같은 자리에 머물러 좌표가 그대로인 경우에도 기온은 다시 받아온다.
      await queryClient.invalidateQueries({
        queryKey: ['weather'],
      })
    },
  })

  return {
    isPending: mutation.isPending || isRefreshing,
    error: mutation.error,
    refresh: () => mutation.mutate(),
  }
}

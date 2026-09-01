import { COOKIES } from '@/constants'
import { GeolocationError } from '@/helper/errors'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
  const mutation = useMutation({
    mutationFn: () => getGeolocationFromClient(),
    onSuccess({ latitude, longitude }) {
      queryClient.invalidateQueries({
        queryKey: ['weather'],
      })

      Cookies.set(COOKIES.COORDS, [latitude, longitude].join('_'), {
        expires: 365,
      })
    },
  })

  return mutation
}

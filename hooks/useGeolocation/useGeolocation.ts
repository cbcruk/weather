import { COOKIES } from '@/constants'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'

function getGeolocationFromClient(): Promise<Partial<GeolocationCoordinates>> {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      })
    } else {
      reject('위치정보 사용 불가능')
    }
  })
}

export function useGeolocation() {
  const result = useQuery({
    queryKey: ['geolocation'],
    queryFn: () => getGeolocationFromClient(),
    enabled: false,
  })

  return result
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

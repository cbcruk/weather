import { useQuery } from '@tanstack/react-query'
import { getGeolocation } from '../../helper'

export function useGeolocation() {
  const result = useQuery({
    queryKey: ['geolocation'],
    queryFn: () => getGeolocation(),
    enabled: false,
  })

  return result
}

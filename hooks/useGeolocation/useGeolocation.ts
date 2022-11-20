import { useQuery } from 'react-query'
import { getGeolocation } from '../../helper'

export const KEY = 'geolocation'

export function useGeolocation() {
  const result = useQuery(KEY, () => getGeolocation(), {
    enabled: false,
  })

  return result
}

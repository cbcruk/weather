import { Geocode } from '@/helper/getGeolocationData'
import { PropsWithChildren } from 'react'
import * as styles from './style'

export function WeatherArea({
  names,
  children,
}: PropsWithChildren<{ names: Array<Geocode['name']> }>) {
  return (
    <div className={styles.location}>
      {names.join(' ')}
      {children}
    </div>
  )
}

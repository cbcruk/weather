import { PropsWithChildren } from 'react'
import * as styles from './style'
import { GeocodeSchema } from '@/app/schema'

export function WeatherArea({
  names,
  children,
}: PropsWithChildren<{ names: Array<GeocodeSchema['name']> }>) {
  return (
    <div className={styles.location}>
      {names.join(' ')}
      {children}
    </div>
  )
}

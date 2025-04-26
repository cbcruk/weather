import { WeatherSchema } from '@/app/schema'
import * as styles from './style'

export function WeatherMinAndMaxTemperature({
  minTemperature,
  maxTemperature,
}: Pick<
  WeatherSchema['halfdayForecast'],
  'minTemperature' | 'maxTemperature'
>) {
  return (
    <span className={styles.temperature}>
      {minTemperature}°—
      {maxTemperature}°
    </span>
  )
}

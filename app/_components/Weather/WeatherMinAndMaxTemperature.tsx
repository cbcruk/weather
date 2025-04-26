import { Weather } from '@/helper/getWeatherData'
import * as styles from './style'

export function WeatherMinAndMaxTemperature({
  minTemperature,
  maxTemperature,
}: Pick<Weather['halfdayForecast'], 'minTemperature' | 'maxTemperature'>) {
  return (
    <span className={styles.temperature}>
      {minTemperature}°—
      {maxTemperature}°
    </span>
  )
}

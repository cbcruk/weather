import * as styles from './style'
import { WeatherShortTermForecast } from './types'

export function WeatherTemperature({
  temperature,
}: Pick<WeatherShortTermForecast, 'temperature'>) {
  return <div className={styles.current}>{temperature}°</div>
}

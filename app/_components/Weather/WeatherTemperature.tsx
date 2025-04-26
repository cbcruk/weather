import { WeatherShortTermForecast } from '@/app/schema'
import * as styles from './style'

export function WeatherTemperature({
  temperature,
}: Pick<WeatherShortTermForecast, 'temperature'>) {
  return <div className={styles.current}>{temperature}°</div>
}

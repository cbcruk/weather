import { PropsWithChildren } from 'react'
import { WeatherShortTermForecast } from './types'
import * as styles from './style'

function getFormattedTemperature(
  temperature: WeatherCompareTemperatureProps['compareTemperature']
) {
  if (temperature > 0) {
    return `어제보다 ${temperature}° 높아요`
  } else if (temperature < 0) {
    return `어제보다 ${temperature}° 낮아요`
  } else {
    return '어제 기온과 같아요'
  }
}

type WeatherCompareTemperatureProps = Pick<
  WeatherShortTermForecast,
  'compareTemperature'
>

export function WeatherCompareTemperature({
  compareTemperature,
  children,
}: PropsWithChildren<WeatherCompareTemperatureProps>) {
  return (
    <div className={styles.status}>
      {getFormattedTemperature(compareTemperature)}
      {children}
    </div>
  )
}

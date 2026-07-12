import { WeatherShortTermForecast } from '@/app/schema'

export function WeatherCondition({
  weatherText,
}: Pick<WeatherShortTermForecast, 'weatherText'>) {
  return <div className="font-semibold">{weatherText}</div>
}

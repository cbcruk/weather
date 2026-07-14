import { WeatherShortTermForecast } from '@/app/schema'

export function WeatherCondition({
  weatherText,
}: Pick<WeatherShortTermForecast, 'weatherText'>) {
  return <div className="text-lg font-semibold">{weatherText}</div>
}

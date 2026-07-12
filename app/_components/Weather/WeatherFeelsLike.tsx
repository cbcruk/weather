import { WeatherShortTermForecast } from '@/app/schema'

export function WeatherFeelsLike({
  stmpr,
}: Pick<WeatherShortTermForecast, 'stmpr'>) {
  return (
    <div className="text-sm font-medium opacity-80">체감 {stmpr}°</div>
  )
}

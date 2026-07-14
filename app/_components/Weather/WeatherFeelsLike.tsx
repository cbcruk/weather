import { WeatherShortTermForecast } from '@/app/schema'

export function WeatherFeelsLike({
  stmpr,
}: Pick<WeatherShortTermForecast, 'stmpr'>) {
  return <div className="text-base font-medium opacity-90">체감 {stmpr}°</div>
}

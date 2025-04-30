import { WeatherShortTermForecast } from '@/app/schema'

export function WeatherTemperature({
  temperature,
}: Pick<WeatherShortTermForecast, 'temperature'>) {
  return <div className="text-[96px] font-black">{temperature}°</div>
}

import { WeatherShortTermForecast } from '@/app/schema'

export function WeatherTemperature({
  temperature,
}: Pick<WeatherShortTermForecast, 'temperature'>) {
  return (
    <div className="text-[72px] font-black leading-none">{temperature}°</div>
  )
}

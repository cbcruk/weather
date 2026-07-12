import { WeatherSchema, WeatherShortTermForecast } from '@/app/schema'
import { WeatherMetricCard } from './WeatherMetricCard'

type Props = {
  forecast: Pick<
    WeatherShortTermForecast,
    'rainProb' | 'humidity' | 'windSpeed'
  >
  air: Pick<WeatherSchema['airForeCast'], 'pm10' | 'pm10Legend' | 'pm10ColorCode'>
}

export function WeatherMetrics({ forecast, air }: Props) {
  return (
    <div className="grid w-full grid-cols-2 gap-3">
      <WeatherMetricCard label="강수확률" value={forecast.rainProb} unit="%" />
      <WeatherMetricCard label="습도" value={forecast.humidity} unit="%" />
      <WeatherMetricCard
        label="미세먼지"
        value={air.pm10Legend}
        accentColor={air.pm10ColorCode}
      />
      <WeatherMetricCard label="바람" value={forecast.windSpeed} unit="m/s" />
    </div>
  )
}

import { WeatherSchema } from '@/app/schema'

export function WeatherMinAndMaxTemperature({
  minTemperature,
  maxTemperature,
}: Pick<
  WeatherSchema['halfdayForecast'],
  'minTemperature' | 'maxTemperature'
>) {
  return (
    <span className="flex">
      {minTemperature}°—
      {maxTemperature}°
    </span>
  )
}

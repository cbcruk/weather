import { WeatherSchema } from '@/app/schema'

export function WeatherMinAndMaxTemperature({
  minTemperature,
  maxTemperature,
}: Pick<
  WeatherSchema['halfdayForecast'],
  'minTemperature' | 'maxTemperature'
>) {
  return (
    <span className="flex flex-col items-start gap-0.5 text-lg font-semibold text-[color:var(--color-accent)]">
      <span className="flex items-center">
        <span aria-hidden className="mr-0.5">
          ↑
        </span>
        {maxTemperature}°
      </span>
      <span className="flex items-center">
        <span aria-hidden className="mr-0.5">
          ↓
        </span>
        {minTemperature}°
      </span>
    </span>
  )
}

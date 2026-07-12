import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import { WeatherSchema } from '@/app/schema'
import { WeatherIcon } from './WeatherIcon'

dayjs.locale('ko')

type DailyForecast =
  WeatherSchema['weeklyForecast']['dailyForecasts'][number]

type Props = {
  forecast: DailyForecast
  isToday: boolean
  isNight: boolean
  rangeMin: number
  rangeMax: number
}

function getDayLabel(applyYmd: string, isToday: boolean) {
  if (isToday) {
    return '오늘'
  }

  const date = dayjs(
    `${applyYmd.slice(0, 4)}-${applyYmd.slice(4, 6)}-${applyYmd.slice(6, 8)}`
  )

  return date.format('ddd')
}

export function WeatherWeeklyForecastRow({
  forecast,
  isToday,
  isNight,
  rangeMin,
  rangeMax,
}: Props) {
  const span = Math.max(rangeMax - rangeMin, 1)
  const left = ((forecast.minTemperature - rangeMin) / span) * 100
  const width = ((forecast.maxTemperature - forecast.minTemperature) / span) * 100

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-9 shrink-0 font-semibold">
        {getDayLabel(forecast.applyYmd, isToday)}
      </span>
      <WeatherIcon
        code={forecast.pmWeatherCode}
        isNight={isNight}
        className="size-7 shrink-0"
      />
      <span className="w-8 shrink-0 text-right opacity-70">
        {forecast.minTemperature}°
      </span>
      <span className="relative h-1.5 flex-1 rounded-full bg-white/15">
        <span
          className="absolute h-full rounded-full bg-gradient-to-r from-sky-300 to-[color:var(--color-accent)]"
          style={{ left: `${left}%`, width: `${Math.max(width, 8)}%` }}
        />
      </span>
      <span className="w-8 shrink-0 font-semibold">
        {forecast.maxTemperature}°
      </span>
    </div>
  )
}

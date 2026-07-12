import dayjs from 'dayjs'
import { WeatherSchema } from '@/app/schema'
import { WeatherWeeklyForecastRow } from './WeatherWeeklyForecastRow'

type Props = {
  dailyForecasts: WeatherSchema['weeklyForecast']['dailyForecasts']
  isNight: boolean
}

export function WeatherWeeklyForecast({ dailyForecasts, isNight }: Props) {
  const forecasts = dailyForecasts.slice(0, 7)

  if (forecasts.length === 0) {
    return null
  }

  const today = dayjs().format('YYYYMMDD')
  const rangeMin = Math.min(...forecasts.map((f) => f.minTemperature))
  const rangeMax = Math.max(...forecasts.map((f) => f.maxTemperature))

  return (
    <div className="flex w-full flex-col gap-3 rounded-3xl bg-white/10 px-5 py-4 backdrop-blur-sm">
      <span className="text-xs font-medium opacity-70">주간 예보</span>
      <div className="flex flex-col gap-2.5">
        {forecasts.map((forecast) => (
          <WeatherWeeklyForecastRow
            key={forecast.applyYmd}
            forecast={forecast}
            isToday={forecast.applyYmd === today}
            isNight={isNight}
            rangeMin={rangeMin}
            rangeMax={rangeMax}
          />
        ))}
      </div>
    </div>
  )
}

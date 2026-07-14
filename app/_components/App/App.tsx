'use client'

import React, { PropsWithChildren, Suspense } from 'react'
import { AppBack } from './AppBack'
import { AppFront } from './AppFront'
import { WeatherMinAndMaxTemperature } from '../Weather/WeatherMinAndMaxTemperature'
import { WeatherTemperature } from '../Weather/WeatherTemperature'
import { WeatherArea } from '../Weather/WeatherArea'
import { WeatherGeolocationButton } from '../Weather/WeatherGeolocationButton'
import { THEME_STATE } from '../../../constants'
import { useSuspenseQuery } from '@tanstack/react-query'
import { weatherOptions } from '@/queries/weather'
import { SearchParamsSchema } from '@/app/schema'
import { WeatherCompareTemperature } from '../Weather/WeatherCompareTemperature'
import { WeatherDate } from '../Weather/WeatherDate'
import { WeatherIcon } from '../Weather/WeatherIcon'
import { WeatherCondition } from '../Weather/WeatherCondition'
import { WeatherFeelsLike } from '../Weather/WeatherFeelsLike'
import { WeatherCard } from '../Weather/WeatherCard'
import { WeatherMetrics } from '../Weather/WeatherMetrics'
import { WeatherWeeklyForecast } from '../Weather/WeatherWeeklyForecast'

export function AppContainer({
  latitude,
  longitude,
  theme,
}: SearchParamsSchema) {
  const { data: weatherData } = useSuspenseQuery(
    weatherOptions({
      latitude,
      longitude,
    })
  )
  const [shortTermForecast] = weatherData.weather.shortTermForecasts

  const isNight = theme === THEME_STATE.DARK
  const area = (
    <WeatherArea
      names={[
        weatherData.geo.region.area1.name,
        weatherData.geo.region.area2.name,
        weatherData.geo.region.area3.name,
      ]}
    >
      <WeatherGeolocationButton />
    </WeatherArea>
  )

  return (
    <>
      <AppFront>
        <div className="flex flex-col items-center gap-1">
          {area}
          <WeatherDate />
        </div>
        <WeatherCard>
          <WeatherCondition weatherText={shortTermForecast.weatherText} />
          <div className="flex w-full items-center justify-center gap-3">
            <WeatherIcon
              code={shortTermForecast.weatherCode}
              isNight={isNight}
              className="size-20 shrink-0"
            />
            <WeatherTemperature temperature={shortTermForecast.temperature} />
            <WeatherMinAndMaxTemperature
              minTemperature={
                weatherData.weather.halfdayForecast.minTemperature
              }
              maxTemperature={
                weatherData.weather.halfdayForecast.maxTemperature
              }
            />
          </div>
          <WeatherFeelsLike stmpr={shortTermForecast.stmpr} />
        </WeatherCard>
        <WeatherCompareTemperature
          compareTemperature={shortTermForecast.compareTemperature}
        />
      </AppFront>
      <AppBack>
        {area}
        <WeatherMetrics
          forecast={shortTermForecast}
          air={weatherData.weather.airForeCast}
        />
        <WeatherWeeklyForecast
          dailyForecasts={weatherData.weather.weeklyForecast.dailyForecasts}
          isNight={isNight}
        />
      </AppBack>
    </>
  )
}

export function App({ children }: PropsWithChildren) {
  return <Suspense fallback={null}>{children}</Suspense>
}

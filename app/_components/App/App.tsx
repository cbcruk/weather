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

  return (
    <>
      <AppFront>
        <WeatherIcon
          code={shortTermForecast.weatherCode}
          isNight={theme === THEME_STATE.DARK}
        />
      </AppFront>
      <AppBack>
        <div className="flex flex-col items-center gap-1">
          <WeatherArea
            names={[
              weatherData.geo.region.area1.name,
              weatherData.geo.region.area2.name,
              weatherData.geo.region.area3.name,
            ]}
          >
            <WeatherGeolocationButton />
          </WeatherArea>
          <WeatherDate />
        </div>
        <WeatherCard>
          <WeatherCondition weatherText={shortTermForecast.weatherText} />
          <div className="flex items-center justify-center gap-4">
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
          <WeatherCompareTemperature
            compareTemperature={shortTermForecast.compareTemperature}
          />
        </WeatherCard>
        <WeatherMetrics
          forecast={shortTermForecast}
          air={weatherData.weather.airForeCast}
        />
      </AppBack>
    </>
  )
}

export function App({ children }: PropsWithChildren) {
  return <Suspense fallback={null}>{children}</Suspense>
}

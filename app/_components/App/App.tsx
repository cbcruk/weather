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
        <WeatherTemperature temperature={shortTermForecast.temperature} />
        <WeatherCompareTemperature
          compareTemperature={shortTermForecast.compareTemperature}
        >
          <WeatherMinAndMaxTemperature
            minTemperature={weatherData.weather.halfdayForecast.minTemperature}
            maxTemperature={weatherData.weather.halfdayForecast.maxTemperature}
          />
        </WeatherCompareTemperature>
      </AppBack>
    </>
  )
}

export function App({ children }: PropsWithChildren) {
  return <Suspense>{children}</Suspense>
}

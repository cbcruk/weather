'use client'

import React, { PropsWithChildren, Suspense, ViewTransition } from 'react'
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
import { WeatherStaleNotice } from '../Weather/WeatherStaleNotice'
import { AppErrorBoundary } from './AppErrorBoundary'
import { WeatherGeolocationNotice } from '../Weather/WeatherGeolocationNotice'
import { useGeolocationMutation } from '@/hooks/useGeolocation/useGeolocation'

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
  const geolocation = useGeolocationMutation()
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
          <WeatherGeolocationButton
            isPending={geolocation.isPending}
            onRefresh={geolocation.refresh}
          />
        </WeatherArea>
        <WeatherDate />
        <WeatherGeolocationNotice
          isPending={geolocation.isPending}
          error={geolocation.error}
        />
        {weatherData.staleAt !== undefined && (
          <WeatherStaleNotice staleAt={weatherData.staleAt} />
        )}
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
  return (
    // 에러 폴백과 본문, 그리고 Suspense 공개를 모두 이 경계 안에서 교체하므로
    // 한 번만 감싸면 세 전환이 전부 크로스페이드가 된다.
    // Transition 과 Suspense 공개에서만 동작한다. 최초 하이드레이션은 해당되지 않는다.
    <ViewTransition>
      <AppErrorBoundary>
        <Suspense fallback={null}>{children}</Suspense>
      </AppErrorBoundary>
    </ViewTransition>
  )
}

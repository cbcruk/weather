import { useAtom } from 'jotai'
import React from 'react'
import { useSpring, animated } from 'react-spring'
import { toggleAtom } from '../../../atom/toggle'
import { useWeather } from '../../../hooks/useWeather/useWeather'
import { getFormattedDate, getFormattedTemperature } from './helper'
import * as styles from './style'
import { useGeolocationMutation } from '@/hooks/useGeolocation/useGeolocation'

function Footer() {
  const { data: weatherData } = useWeather()
  const [isSelected] = useAtom(toggleAtom)
  const style = useSpring({
    from: { opacity: 0 },
    opacity: isSelected ? 1 : 0,
    backdropFilter: `blur(${isSelected ? 10 : 0}px)`,
    config: { duration: 1000 },
  })

  const mutation = useGeolocationMutation()

  if (!weatherData) {
    return null
  }

  const { weather, geo } = weatherData

  return (
    <animated.div className={styles.wrapper} style={style}>
      <div className={styles.location}>
        {[
          geo.region.area1.name,
          geo.region.area2.name,
          geo.region.area3.name,
        ].join(' ')}
        <button
          className={styles.button}
          onClick={async (e) => {
            e.stopPropagation()
            await mutation.mutateAsync()
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            fill="currentColor"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
          </svg>
        </button>
      </div>
      <div className={styles.date}>{getFormattedDate()}</div>
      <div className={styles.current}>
        {weather.shortTermForecasts[0].temperature}°
      </div>
      <div className={styles.status}>
        {getFormattedTemperature(
          weather.shortTermForecasts[0].compareTemperature
        )}
        <span className={styles.temperature}>
          {weather.halfdayForecast.minTemperature}°—
          {weather.halfdayForecast.maxTemperature}°
        </span>
      </div>
    </animated.div>
  )
}

export default Footer

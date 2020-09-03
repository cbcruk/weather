import React from 'react'
import { cx } from 'emotion'
import { useGeolocation, useToggle, useWeather } from './hooks'
import { Body, Footer } from './components'
import * as styles from './style'

function App() {
  const { regionCode } = useGeolocation()
  const { state: weatherState } = useWeather(regionCode)
  const { state: selected, toggle } = useToggle()

  const {
    isNight,
    icon,
    lowestTemperature,
    highestTemperature,
    current,
    status,
    location,
  } = weatherState.data || {}

  return (
    <div
      className={cx([
        styles.wrapper,
        {
          'is-night': isNight,
        },
      ])}
      onClick={toggle}
    >
      <Body icon={icon} isNight={isNight} selected={selected} />
      <Footer
        lowestTemperature={lowestTemperature}
        highestTemperature={highestTemperature}
        current={current}
        status={status}
        location={location}
        selected={selected}
      />
    </div>
  )
}

export default App

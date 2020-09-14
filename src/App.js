import React from 'react'
import { cx } from 'emotion'
import { useGeolocation, useToggle, useWeather } from './hooks'
import { Body, Footer } from './components'
import * as styles from './style'

function App() {
  const { coords } = useGeolocation()
  const { data: weatherData } = useWeather(coords)
  const { state: selected, toggle } = useToggle()

  const {
    isNight,
    icon,
    lowestTemperature,
    highestTemperature,
    current,
    status,
    location,
  } = weatherData || {}

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

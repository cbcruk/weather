import React from 'react'
import { cx } from '@emotion/css'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { useGeolocation, useToggle, useWeather } from './hooks'
import { Body, Footer } from './components'
import * as styles from './style'

function App() {
  const { coords } = useGeolocation()
  const { data } = useWeather(coords)
  const { state: selected, toggle } = useToggle()

  if (!data) {
    return null
  }

  const {
    city: { name },
    current: { isNight, main, weather },
    hourly,
  } = data

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
      <Body icon={weather.icon} isNight={isNight} selected={selected} />
      <Footer
        lowestTemperature={main.tempMin}
        highestTemperature={main.tempMax}
        current={main.temp}
        status={weather.description}
        location={name}
        selected={selected}
      >
        <ResponsiveContainer width="100%" height={100}>
          <LineChart
            margin={{
              top: 50,
            }}
            data={hourly.slice(0, 12)}
          >
            <Line
              type="monotone"
              dataKey="main.temp"
              stroke="#fff"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Footer>
    </div>
  )
}

export default App

import React from 'react'
import { useAtom } from 'jotai'
import { cx } from '@emotion/css'
import { fetchWeatherAtom } from './atom/weather'
import { toggleAtom } from './atom/toggle'
import { Body, Footer } from './components'
import * as styles from './style'

function App() {
  const [weatherData] = useAtom(fetchWeatherAtom)
  const [, toggle] = useAtom(toggleAtom)
  const {
    current: { isNight },
  } = weatherData

  return (
    <div
      className={cx([
        styles.wrapper,
        {
          [styles.isNight]: isNight,
        },
      ])}
      onClick={() => toggle((prev) => !prev)}
    >
      <Body />
      <Footer />
    </div>
  )
}

export default App

'use client'

import { useAtom } from 'jotai'
import React from 'react'
import { animated, useSpring } from 'react-spring'
import { cx } from '@emotion/css'
import { toggleAtom } from '../../../atom/toggle'
import Body from '../Body'
import Footer from '../Footer'
import * as styles from './style'
import { THEME_STATE } from '../../../constants'
import { useWeather } from '../../../hooks/useWeather'

function App() {
  const { data: weatherData } = useWeather()
  const [, toggle] = useAtom(toggleAtom)
  const spring = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 400,
    config: { duration: 600 },
  })

  if (!weatherData) {
    return null
  }

  const { theme } = weatherData

  return (
    <animated.div
      className={cx([
        styles.wrapper,
        {
          [styles.isNight]: theme === THEME_STATE.DARK,
          [styles.isNoon]: theme === THEME_STATE.LIGHT,
        },
      ])}
      style={spring}
      onClick={() => toggle((prev) => !prev)}
    >
      <Body />
      <Footer />
    </animated.div>
  )
}

export default App

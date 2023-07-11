import { useAtom } from 'jotai'
import React from 'react'
import { useSpring, animated } from 'react-spring'
import { toggleAtom } from '../../../atom/toggle'
import { THEME_STATE } from '../../../constants'
import { useWeather } from '../../../hooks/useWeather'
import { Icon } from './components'
import * as styles from './style'

function Body() {
  const { data: weatherData } = useWeather()
  const [isSelected] = useAtom(toggleAtom)
  const style = useSpring({
    from: { opacity: 1 },
    opacity: isSelected ? 0.5 : 1,
    config: { duration: 1000 },
  })

  if (!weatherData) {
    return null
  }

  const { weather, theme } = weatherData

  return (
    <animated.div className={styles.wrapper} style={style}>
      <Icon
        code={weather.today.weatherCode}
        isNight={theme === THEME_STATE.DARK}
      />
    </animated.div>
  )
}

export default Body

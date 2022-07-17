import { useAtom } from 'jotai'
import React from 'react'
import { useSpring, animated } from 'react-spring'
import { toggleAtom } from '../../atom/toggle'
import { THEME_STATE } from '../../constants'
import { useWeather } from '../../hooks/useWeather'
import { Icon } from './components'
import * as styles from './style'

function Body() {
  const {
    data: { weather },
  } = useWeather()
  const [isSelected] = useAtom(toggleAtom)
  const style = useSpring({
    from: { opacity: 1, filter: 'blur(0px)' },
    opacity: isSelected ? 0.5 : 1,
    filter: `blur(${isSelected ? 10 : 0}px)`,
    config: { duration: 1000 },
  })

  return (
    <animated.div className={styles.wrapper} style={style}>
      <Icon
        code={weather.today.weatherCode}
        isNight={weather.theme === THEME_STATE.DARK}
      />
    </animated.div>
  )
}

export default Body

import { useAtom } from 'jotai'
import React from 'react'
import { useSpring, animated } from 'react-spring'
import { nightAtom } from '../../atom/sunCalc'
import { toggleAtom } from '../../atom/toggle'
import { fetchWeatherAtom } from '../../atom/weather'
import { Icon } from './components'
import * as styles from './style'

function Body() {
  const [{ weather }] = useAtom(fetchWeatherAtom)
  const [isSelected] = useAtom(toggleAtom)
  const [isNight] = useAtom(nightAtom)
  const style = useSpring({
    from: { opacity: 1, filter: 'blur(0px)' },
    opacity: isSelected ? 0.5 : 1,
    filter: `blur(${isSelected ? 10 : 0}px)`,
    config: { duration: 1000 },
  })

  return (
    <animated.div className={styles.wrapper} style={style}>
      <Icon code={weather.today.weatherCode} isNight={isNight} />
    </animated.div>
  )
}

export default Body

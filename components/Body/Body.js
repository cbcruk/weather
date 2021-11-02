import { useAtom } from 'jotai'
import React from 'react'
import { useSpring, animated } from 'react-spring'
import { sunsetAtom } from '../../atom/sunCalc'
import { toggleAtom } from '../../atom/toggle'
import { weatherAtom } from '../../atom/weather'
import { Icon } from './components'
import * as styles from './style'

function Body() {
  const [weatherState] = useAtom(weatherAtom)
  const [isSelected] = useAtom(toggleAtom)
  const [state] = useAtom(sunsetAtom)
  const style = useSpring({
    from: { opacity: 1, filter: 'blur(0px)' },
    opacity: isSelected ? 0.5 : 1,
    filter: `blur(${isSelected ? 10 : 0}px)`,
    config: { duration: 1000 },
  })

  return (
    <animated.div className={styles.wrapper} style={style}>
      <Icon
        code={weatherState?.weather?.today?.weatherCode}
        isNight={state === 'night'}
      />
    </animated.div>
  )
}

export default Body

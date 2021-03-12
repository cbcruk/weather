import { useAtom } from 'jotai'
import React from 'react'
import { useSpring, animated } from 'react-spring'
import { toggleAtom } from '../../atom/toggle'
import { weatherAtom } from '../../atom/weather'
import { Icon } from './components'
import * as styles from './style'

function Body() {
  const [
    {
      current: {
        isNight,
        weather: { icon },
      },
    },
  ] = useAtom(weatherAtom)
  const [isSelected] = useAtom(toggleAtom)
  const style = useSpring({
    from: { opacity: 1, filter: 'blur(0px)' },
    opacity: isSelected ? 0.5 : 1,
    filter: `blur(${isSelected ? 10 : 0}px)`,
    config: { duration: 1000 },
  })

  return (
    <animated.div className={styles.wrapper} style={style}>
      {icon && <Icon icon={icon} isNight={isNight} />}
    </animated.div>
  )
}

export default Body

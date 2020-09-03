import React from 'react'
import { useSpring, animated } from 'react-spring'
import { Icon } from './components'
import * as styles from './style'

function Body({ icon, isNight, selected }) {
  const style = useSpring({
    from: { opacity: 1, filter: 'blur(0px)' },
    opacity: selected ? 0.5 : 1,
    filter: `blur(${selected ? 10 : 0}px)`,
    config: { duration: 1000 },
  })

  return (
    <animated.div className={styles.wrapper} style={style}>
      {icon && <Icon icon={icon} isNight={isNight} />}
    </animated.div>
  )
}

export default Body

import React from 'react'
import { useSpring, animated } from 'react-spring'
import getFormattedDate from './helper/getFormattedDate'
import * as styles from './style'

function Footer({
  lowestTemperature,
  highestTemperature,
  current,
  status,
  location,
  selected
}) {
  const style = useSpring({
    from: { opacity: 0 },
    opacity: selected ? 1 : 0,
    config: { duration: 1000 }
  })

  return (
    <animated.div className={styles.wrapper} style={style}>
      <div className={styles.location}>{location}</div>
      <div className={styles.date}>{getFormattedDate()}</div>
      <div className={styles.current}>{current}°</div>
      <div className={styles.status}>
        {status}
        <span className={styles.temperature}>
          {highestTemperature}°—{lowestTemperature}°
        </span>
      </div>
    </animated.div>
  )
}

export default Footer

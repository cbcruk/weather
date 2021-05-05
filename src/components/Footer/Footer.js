import { useAtom } from 'jotai'
import React from 'react'
import { useSpring, animated } from 'react-spring'
import { toggleAtom } from '../../atom/toggle'
import { fetchWeatherAtom } from '../../atom/weather'
import { getFormattedDate, getFormattedTemperature } from './helper'
import * as styles from './style'

function Footer({ children }) {
  const [{ geo, weather }] = useAtom(fetchWeatherAtom)
  const [isSelected] = useAtom(toggleAtom)
  const style = useSpring({
    from: { opacity: 0 },
    opacity: isSelected ? 1 : 0,
    config: { duration: 1000 },
  })
  const {
    temperature,
    compareTemperature,
    minTemperature,
    maxTemperature,
  } = weather.today

  return (
    <animated.div className={styles.wrapper} style={style}>
      <div className={styles.location}>{geo.address}</div>
      <div className={styles.date}>{getFormattedDate()}</div>
      <div className={styles.current}>{temperature}°</div>
      <div className={styles.status}>
        {getFormattedTemperature(compareTemperature)}
        <span className={styles.temperature}>
          {minTemperature}°—{maxTemperature}°
        </span>
      </div>
      {children}
    </animated.div>
  )
}

export default Footer

import { useAtom } from 'jotai'
import React from 'react'
import { useSpring, animated } from 'react-spring'
import { toggleAtom } from '../../atom/toggle'
import { weatherAtom } from '../../atom/weather'
import Chart from '../Chart'
import getFormattedDate from './helper/getFormattedDate'
import * as styles from './style'

function Footer({ children }) {
  const [weatherData] = useAtom(weatherAtom)
  const {
    city: { name },
    current: { main, weather },
  } = weatherData
  const [isSelected] = useAtom(toggleAtom)
  const style = useSpring({
    from: { opacity: 0 },
    opacity: isSelected ? 1 : 0,
    config: { duration: 1000 },
  })

  return (
    <animated.div className={styles.wrapper} style={style}>
      <div className={styles.location}>{name}</div>
      <div className={styles.date}>{getFormattedDate()}</div>
      <div className={styles.current}>{main.temp}°</div>
      <div className={styles.status}>
        {weather.description}
        <span className={styles.temperature}>
          {main.tempMin}°—{main.tempMax}°
        </span>
      </div>
      <Chart />
      {children}
    </animated.div>
  )
}

export default Footer

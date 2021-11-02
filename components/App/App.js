import React from 'react'
import { useAtom } from 'jotai'
import { cx } from '@emotion/css'
import { toggleAtom } from '../../atom/toggle'
import { sunsetAtom } from '../../atom/sunCalc'
import { SUNSET_STATE } from '../../helper/getSunsetState'
import Body from '../Body'
import Footer from '../Footer'
import * as styles from './style'
import { animated, useSpring } from 'react-spring'
import { weatherAtom } from '../../atom/weather'

function App() {
  const [] = useAtom(weatherAtom)
  const [state] = useAtom(sunsetAtom)
  const [, toggle] = useAtom(toggleAtom)
  const spring = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 400,
    config: { duration: 600 },
  })

  return (
    <animated.div
      className={cx([
        styles.wrapper,
        {
          [styles.isNight]: state === SUNSET_STATE.night,
          [styles.isNoon]: state === SUNSET_STATE.afternoon,
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

import { useAtom } from 'jotai'
import React, { PropsWithChildren } from 'react'
import { useSpring, animated } from 'react-spring'
import { toggleAtom } from '../../../atom/toggle'
import * as styles from './AppFront.style'

export function AppFront({ children }: PropsWithChildren) {
  const [isSelected] = useAtom(toggleAtom)
  const style = useSpring({
    from: { opacity: 1 },
    opacity: isSelected ? 0.5 : 1,
    config: { duration: 1000 },
  })

  return (
    <animated.div className={styles.wrapper} style={style}>
      {children}
    </animated.div>
  )
}

import { useAtom } from 'jotai'
import React, { PropsWithChildren } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { toggleAtom } from '../../../atom/toggle'
import * as styles from './AppBack.style'

const AnimatedDiv = animated('div')

export function AppBack({ children }: PropsWithChildren) {
  const [isSelected] = useAtom(toggleAtom)
  const style = useSpring({
    from: { opacity: 0 },
    opacity: isSelected ? 1 : 0,
    backdropFilter: `blur(${isSelected ? 10 : 0}px)`,
    config: { duration: 1000 },
  })

  return (
    <AnimatedDiv className={styles.wrapper} style={style}>
      {children}
    </AnimatedDiv>
  )
}

'use client'

import { cx } from '@emotion/css'
import { useSpring, animated } from 'react-spring'
import * as styles from './AppSpring.style'
import { ComponentProps } from 'react'
import { toggleAtom } from '@/atom/toggle'
import { useAtom } from 'jotai'

type SpringOpacityProps = ComponentProps<'div'>

export function AppSpring({ children, ref, ...props }: SpringOpacityProps) {
  const [, toggle] = useAtom(toggleAtom)
  const spring = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 400,
    config: { duration: 600 },
  })

  return (
    <animated.div
      className={cx([styles.wrapper])}
      style={spring}
      onClick={() => toggle((prev) => !prev)}
      {...props}
    >
      {children}
    </animated.div>
  )
}

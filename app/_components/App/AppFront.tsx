import { useAtom } from 'jotai'
import React, { PropsWithChildren } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { toggleAtom } from '../../../atom/toggle'

const AnimatedDiv = animated('div')

export function AppFront({ children }: PropsWithChildren) {
  const [isSelected] = useAtom(toggleAtom)
  const style = useSpring({
    from: { opacity: 1 },
    opacity: isSelected ? 0.5 : 1,
    config: { duration: 1000 },
  })

  return (
    <AnimatedDiv
      className="flex flex-col items-center justify-center flex-1 relative z-10 text-xs text-white p-[30px]"
      style={style}
    >
      {children}
    </AnimatedDiv>
  )
}

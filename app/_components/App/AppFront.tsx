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
      className="relative z-10 mx-auto flex w-full max-w-[440px] flex-1 flex-col items-center justify-center gap-4 px-6 py-10 text-base text-white"
      style={style}
    >
      {children}
    </AnimatedDiv>
  )
}

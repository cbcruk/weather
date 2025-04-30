import { useAtom } from 'jotai'
import React, { PropsWithChildren } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { toggleAtom } from '../../../atom/toggle'

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
    <AnimatedDiv
      className="fixed z-10 flex flex-col justify-end w-full h-full text-[21px] text-white p-[30px] left-0 top-0"
      style={style}
    >
      {children}
    </AnimatedDiv>
  )
}

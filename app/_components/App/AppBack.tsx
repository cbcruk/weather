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
      className="fixed inset-0 z-10 overflow-y-auto text-[21px] text-white"
      style={{ ...style, pointerEvents: isSelected ? 'auto' : 'none' }}
    >
      <div className="mx-auto flex min-h-full max-w-[440px] flex-col items-center justify-center gap-6 px-6 py-10">
        {children}
      </div>
    </AnimatedDiv>
  )
}

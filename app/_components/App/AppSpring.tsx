'use client'

import { ComponentProps } from 'react'
import { toggleAtom } from '@/atom/toggle'
import { useAtom } from 'jotai'
import styles from './AppSpring.module.css'

type SpringOpacityProps = ComponentProps<'div'>

export function AppSpring({ children, ...props }: SpringOpacityProps) {
  const [, toggle] = useAtom(toggleAtom)

  return (
    <div
      className={`flex flex-col h-screen min-h-screen bg-[color:var(--color-background-afternoon)] transition-[background-color] duration-[3s] animate-none ${styles.wrapper}`}
      onClick={() => toggle((prev) => !prev)}
      {...props}
    >
      {children}
    </div>
  )
}

'use client'

import dynamic from 'next/dynamic'
import { ICONS_DAY, ICONS_NIGHT } from '../WeatherIcon.constants'
import type { WeatherIcon3DProps } from './weather-icon-3d.types'

const WeatherCanvas = dynamic(
  () => import('./canvas').then((mod) => mod.WeatherCanvas),
  { ssr: false },
)

function getIconNumber(code: string, isNight: boolean): string {
  const key = parseInt(code, 10) as keyof typeof ICONS_NIGHT
  const iconNumber = isNight
    ? ICONS_NIGHT[key] || ICONS_DAY[key]
    : ICONS_DAY[key]

  return iconNumber || '1'
}

export function WeatherIcon3D({
  code,
  isNight,
  mode = 'extrude',
  enableInteraction = true,
  className,
}: WeatherIcon3DProps) {
  const iconNumber = getIconNumber(code, isNight)

  return (
    <WeatherCanvas
      iconNumber={iconNumber}
      mode={mode}
      enableInteraction={enableInteraction}
      className={className}
    />
  )
}

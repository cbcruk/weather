import React from 'react'
import { IMAGE_PATH, ICONS_DAY, ICONS_NIGHT } from './WeatherIcon.constants'

type Props = {
  code: string
  isNight: boolean
}

export function WeatherIcon({ code, isNight }: Props) {
  const key = parseInt(code, 10) as keyof typeof ICONS_NIGHT
  const value = isNight ? ICONS_NIGHT[key] || ICONS_DAY[key] : ICONS_DAY[key]
  const src = `${IMAGE_PATH}/ico_animation_wt${value}.svg`

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" className="w-full max-w-[375px]" />
}

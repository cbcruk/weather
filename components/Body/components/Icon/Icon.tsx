import React from 'react'
import { IMAGE_PATH, ICONS_DAY, ICONS_NIGHT } from './constants'
import * as styles from './style'

type Props = {
  code: keyof (typeof ICONS_NIGHT | typeof ICONS_DAY)
  isNight: boolean
}

function Icon({ code, isNight }: Props) {
  const value = isNight ? ICONS_NIGHT[code] : ICONS_DAY[code]
  const src = `${IMAGE_PATH}/ico_animation_wt${value}.svg`

  return <img src={src} alt="" className={styles.wrapper} />
}

export default Icon

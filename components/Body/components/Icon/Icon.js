import React from 'react'
import { IMAGE_PATH, ICONS_DAY, ICONS_NIGHT } from './constants'
import * as styles from './style'

function Icon({ code, isNight }) {
  const value = (isNight && ICONS_NIGHT[code]) || ICONS_DAY[code]
  const src = `${IMAGE_PATH}/ico_animation_wt${value}.svg`

  return <img src={src} alt="" className={styles.wrapper} />
}

export default Icon

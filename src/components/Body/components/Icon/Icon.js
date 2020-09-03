import React from 'react'
import { IMAGE_PATH, ICONS_DAY, ICONS_NIGHT } from './constants'
import * as styles from './style'

function Icon({ icon, isNight }) {
  const name = (isNight && ICONS_NIGHT[icon]) || ICONS_DAY[icon]
  const src = `${IMAGE_PATH}/${name}.svg`

  return <img src={src} alt="" className={styles.wrapper} />
}

export default Icon

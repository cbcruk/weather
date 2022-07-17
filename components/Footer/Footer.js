import { useAtom } from 'jotai'
import Cookies from 'js-cookie'
import React from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useSpring, animated } from 'react-spring'
import { toggleAtom } from '../../atom/toggle'
import { COOKIES } from '../../constants'
import { getGeolocation } from '../../helper'
import { useWeather } from '../../hooks/useWeather'
import { getFormattedDate, getFormattedTemperature } from './helper'
import * as styles from './style'

function Footer() {
  const {
    data: { weather, geo },
  } = useWeather()
  const [isSelected] = useAtom(toggleAtom)
  const style = useSpring({
    from: { opacity: 0 },
    opacity: isSelected ? 1 : 0,
    config: { duration: 1000 },
  })
  const queryClient = useQueryClient()
  const mutation = useMutation(() => getGeolocation(), {
    onSuccess({ latitude, longitude }) {
      Cookies.set(COOKIES.COORDS, [latitude, longitude].join('_'))
    },
  })

  const { temperature, compareTemperature, minTemperature, maxTemperature } =
    weather.today

  return (
    <animated.div className={styles.wrapper} style={style}>
      <div className={styles.location}>
        {geo.address}
        <button
          className={styles.button}
          onClick={async (e) => {
            e.stopPropagation()
            await mutation.mutateAsync()
            queryClient.invalidateQueries('weather')
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            fill="currentColor"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
          </svg>
        </button>
      </div>
      <div className={styles.date}>{getFormattedDate()}</div>
      <div className={styles.current}>{temperature}°</div>
      <div className={styles.status}>
        {getFormattedTemperature(compareTemperature)}
        <span className={styles.temperature}>
          {minTemperature}°—{maxTemperature}°
        </span>
      </div>
    </animated.div>
  )
}

export default Footer

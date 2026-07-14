import { PropsWithChildren } from 'react'
import { CARD_CLIP_PATH_ID, CARD_SQUIRCLE_PATH } from './WeatherCard.constants'

export function WeatherCard({ children }: PropsWithChildren) {
  return (
    <div className="weather-card-shadow w-full">
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <clipPath id={CARD_CLIP_PATH_ID} clipPathUnits="objectBoundingBox">
            <path d={CARD_SQUIRCLE_PATH} />
          </clipPath>
        </defs>
      </svg>
      <div className="weather-card px-8 py-10">
        <div className="relative z-10 flex flex-col items-center gap-3 text-center">
          {children}
        </div>
      </div>
    </div>
  )
}

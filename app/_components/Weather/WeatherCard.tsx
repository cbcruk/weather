import { PropsWithChildren } from 'react'

export function WeatherCard({ children }: PropsWithChildren) {
  return (
    <div className="weather-card w-full px-7 py-8">
      <div className="relative z-10 flex flex-col items-center gap-1 text-center">
        {children}
      </div>
    </div>
  )
}

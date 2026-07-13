import { PropsWithChildren } from 'react'
import { GeocodeSchema } from '@/app/schema'

export function WeatherArea({
  names,
  children,
}: PropsWithChildren<{ names: Array<GeocodeSchema['name']> }>) {
  const label = names
    .map((name) => name.trim())
    .filter(Boolean)
    .join(' ')

  return (
    <div className="flex items-center gap-2.5 font-semibold">
      {label}
      {children}
    </div>
  )
}

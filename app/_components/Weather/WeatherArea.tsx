import { PropsWithChildren } from 'react'
import { GeocodeSchema } from '@/app/schema'

export function WeatherArea({
  names,
  children,
}: PropsWithChildren<{ names: Array<GeocodeSchema['name']> }>) {
  return (
    <div className="flex items-center gap-2.5 font-semibold">
      {names.join(' ')}
      {children}
    </div>
  )
}

import { ReactNode } from 'react'

type Props = {
  label: string
  value: ReactNode
  unit?: string
  accentColor?: string
}

export function WeatherMetricCard({ label, value, unit, accentColor }: Props) {
  return (
    <div className="flex flex-col justify-between gap-2 rounded-3xl bg-white/10 px-4 py-3.5 backdrop-blur-sm">
      <span className="flex items-center gap-1.5 text-xs font-medium opacity-70">
        {accentColor ? (
          <span
            aria-hidden
            className="inline-block size-2 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        ) : null}
        {label}
      </span>
      <span className="text-2xl font-bold leading-none">
        {value}
        {unit ? (
          <span className="ml-0.5 text-sm font-medium opacity-70">{unit}</span>
        ) : null}
      </span>
    </div>
  )
}

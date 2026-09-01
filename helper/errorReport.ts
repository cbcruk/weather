import { z } from 'zod'

export const ERROR_SOURCE = {
  server: 'server',
  boundary: 'boundary',
  route: 'route',
} as const

export const errorReportSchema = z.object({
  tag: z.string().max(64),
  message: z.string().max(1000),
  source: z.nativeEnum(ERROR_SOURCE),
  path: z.string().max(500).optional(),
  digest: z.string().max(64).optional(),
})

export type ErrorReport = z.infer<typeof errorReportSchema>

/**
 * 좌표는 사용자의 실제 위치다. 진단에는 대략의 지역이면 충분하므로
 * 소수 2자리(약 1km)로 줄여서 내보낸다.
 */
export function redactCoords(text: string) {
  return text.replace(/-?\d+\.\d{3,}/g, (match) =>
    Number.parseFloat(match).toFixed(2)
  )
}

function tagOf(error: unknown) {
  if (typeof error === 'object' && error !== null && '_tag' in error) {
    return String((error as { _tag: unknown })._tag)
  }

  return error instanceof Error ? error.name : 'UnknownError'
}

function messageOf(error: unknown) {
  if (error instanceof Error) {
    return error.message || String(error)
  }

  return String(error)
}

export function toErrorReport(
  error: unknown,
  source: ErrorReport['source'],
  extra: Pick<ErrorReport, 'path' | 'digest'> = {}
): ErrorReport {
  return {
    tag: tagOf(error),
    message: redactCoords(messageOf(error)).slice(0, 1000),
    source,
    ...extra,
  }
}

import { z } from 'zod'
import { geocodeResultSchema, weatherResponseSchema } from '@/app/schema'
import { GetWeatherDataByGeolocationParams } from './getWeatherDataByGeolocation'

const KEY_PREFIX = 'weather-snapshot'

/** 이보다 오래된 스냅샷은 보여주지 않는다. 너무 낡은 날씨는 없느니만 못하다. */
const MAX_AGE_MS = 24 * 60 * 60 * 1000

/**
 * 읽을 때 검증한다. 저장된 값은 이전 버전 앱이 남긴 것일 수 있고,
 * 스키마가 바뀌었다면 그대로 렌더하다 화면에서 터진다.
 */
const snapshotSchema = z.object({
  at: z.number(),
  data: z.object({
    geo: geocodeResultSchema,
    weather: weatherResponseSchema,
  }),
})

export type WeatherSnapshot = z.infer<typeof snapshotSchema>

function keyOf({ latitude, longitude }: GetWeatherDataByGeolocationParams) {
  // 위치가 다르면 다른 스냅샷이다. 이전 위치의 날씨를 보여주면 안 된다.
  return `${KEY_PREFIX}:${latitude},${longitude}`
}

/** localStorage 는 시크릿 모드나 용량 초과로 그냥 던진다. 저장 실패가 앱을 막으면 안 된다. */
export function saveWeatherSnapshot(
  params: GetWeatherDataByGeolocationParams,
  data: WeatherSnapshot['data']
) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(
      keyOf(params),
      JSON.stringify({ at: Date.now(), data })
    )
  } catch {
    // 저장은 best-effort다.
  }
}

export function loadWeatherSnapshot(
  params: GetWeatherDataByGeolocationParams
): WeatherSnapshot | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const raw = window.localStorage.getItem(keyOf(params))

    if (!raw) {
      return null
    }

    const parsed = snapshotSchema.safeParse(JSON.parse(raw))

    if (!parsed.success || Date.now() - parsed.data.at > MAX_AGE_MS) {
      window.localStorage.removeItem(keyOf(params))
      return null
    }

    return parsed.data
  } catch {
    return null
  }
}

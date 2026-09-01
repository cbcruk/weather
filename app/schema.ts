import { z } from 'zod'

export const searchParamsSchema = z.object({
  latitude: z.string(),
  longitude: z.string(),
  theme: z.string(),
})

export type SearchParamsSchema = z.infer<typeof searchParamsSchema>

/**
 * 검증 범위 정책
 *
 * 이 앱이 의존하는 Naver API는 비공식이라 예고 없이 응답이 바뀐다.
 * 실제로 064e85d 에서 `airForeCast.stationAddr` 이 null 이 되면서,
 * 앱이 한 번도 쓰지 않는 필드 때문에 전면 장애가 났다.
 *
 * 그래서 화면 렌더에 실제로 쓰는 필드만 검증한다.
 * zod는 정의하지 않은 키를 기본으로 버리므로(strip), 나머지가 어떻게
 * 바뀌든 SchemaError 로 이어지지 않는다.
 *
 * 필드를 새로 쓰기 시작할 때만 여기에 추가하면 된다.
 */

const geocodeResultSchema = z.object({
  name: z.string(),
  code: z.object({
    mappingId: z.string(),
  }),
  region: z.object({
    area1: z.object({ name: z.string() }),
    area2: z.object({ name: z.string() }),
    area3: z.object({ name: z.string() }),
  }),
})

export const geocodeResponseSchema = z.object({
  results: z.array(geocodeResultSchema),
})

export type GeocodeSchema = z.infer<typeof geocodeResultSchema>

const shortTermForecastSchema = z.object({
  weatherCode: z.string(),
  temperature: z.number(),
  compareTemperature: z.number(),
})

const halfdayForecastSchema = z.object({
  minTemperature: z.number(),
  maxTemperature: z.number(),
})

export const weatherResponseSchema = z.object({
  // 첫 항목을 무조건 꺼내 쓰므로(App.tsx), 비어 있으면 렌더 중 TypeError가 된다.
  // min(1)로 여기서 SchemaError 로 잡는다.
  shortTermForecasts: z.array(shortTermForecastSchema).min(1),
  halfdayForecast: halfdayForecastSchema,
})

export type WeatherSchema = z.infer<typeof weatherResponseSchema>

export type WeatherShortTermForecast =
  WeatherSchema['shortTermForecasts'][number]

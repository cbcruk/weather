import { z } from 'zod'

export const searchParamsSchema = z.object({
  latitude: z.string(),
  longitude: z.string(),
  theme: z.string(),
})

export type SearchParamsSchema = z.infer<typeof searchParamsSchema>

export const geocodeResponseSchema = z.object({
  status: z.object({ code: z.number(), name: z.string(), message: z.string() }),
  results: z.array(
    z.object({
      name: z.string(),
      code: z.object({
        id: z.string(),
        type: z.string(),
        mappingId: z.string(),
      }),
      region: z.object({
        area0: z.object({
          name: z.string(),
          coords: z.object({
            center: z.object({ crs: z.string(), x: z.number(), y: z.number() }),
          }),
        }),
        area1: z.object({
          name: z.string(),
          coords: z.object({
            center: z.object({ crs: z.string(), x: z.number(), y: z.number() }),
          }),
          alias: z.string(),
        }),
        area2: z.object({
          name: z.string(),
          coords: z.object({
            center: z.object({ crs: z.string(), x: z.number(), y: z.number() }),
          }),
        }),
        area3: z.object({
          name: z.string(),
          coords: z.object({
            center: z.object({ crs: z.string(), x: z.number(), y: z.number() }),
          }),
        }),
        area4: z.object({
          name: z.string(),
          coords: z.object({
            center: z.object({ crs: z.string(), x: z.number(), y: z.number() }),
          }),
        }),
      }),
    })
  ),
})

export type GeocodeSchema = z.infer<
  typeof geocodeResponseSchema
>['results'][number]

export const weatherResponseSchema = z.object({
  regionCode: z.string(),
  largeAreaName: z.string(),
  middleAreaName: z.string(),
  smallAreaName: z.string(),
  observeYmdt: z.string(),
  detailUrl: z.string(),
  displayTermType: z.string(),
  announcement: z.string(),
  announcementUrl: z.string(),
  shortTermForecasts: z.array(
    z.object({
      applyYmd: z.string(),
      applyHour: z.string(),
      weatherCode: z.string(),
      weatherText: z.string(),
      temperature: z.number(),
      decimalTemperature: z.number(),
      compareTemperature: z.number(),
      stmpr: z.number(),
      oneHourRainAmt: z.number(),
      rainAmount: z.number(),
      windDirection: z.string(),
      windSpeed: z.number(),
      humidity: z.number(),
      detailUrl: z.string(),
      rainProb: z.number(),
    })
  ),
  halfdayForecast: z.object({
    applyYmd: z.string(),
    minTemperature: z.number(),
    amTemperature: z.number(),
    maxTemperature: z.number(),
    pmTemperature: z.number(),
    amWetrCd: z.string(),
    amWeatherCode: z.string(),
    pmWetrCd: z.string(),
    pmWeatherCode: z.string(),
    amWetrTxt: z.string(),
    amWeatherText: z.string(),
    pmWetrTxt: z.string(),
    pmWeatherText: z.string(),
    amWetrRainProb: z.number(),
    amRainProbability: z.number(),
    pmWetrRainProb: z.number(),
    pmRainProbability: z.number(),
    fcastYmdt: z.string(),
  }),
  weeklyForecast: z.object({
    regionCode: z.string(),
    largeAreaName: z.string(),
    middleAreaName: z.string(),
    smallAreaName: z.string(),
    observeYmdt: z.string(),
    dailyForecasts: z.array(
      z.object({
        applyYmd: z.string(),
        minTemperature: z.number(),
        amTemperature: z.number(),
        maxTemperature: z.number(),
        pmTemperature: z.number(),
        amWetrCd: z.string(),
        amWeatherCode: z.string(),
        pmWetrCd: z.string(),
        pmWeatherCode: z.string(),
        amWetrTxt: z.string(),
        amWeatherText: z.string(),
        pmWetrTxt: z.string(),
        pmWeatherText: z.string(),
        amWetrRainProb: z.number(),
        amRainProbability: z.number(),
        pmWetrRainProb: z.number(),
        pmRainProbability: z.number(),
        fcastYmdt: z.string(),
      })
    ),
  }),
  airForeCast: z.object({
    fcastYmdt: z.string(),
    stationId: z.null(),
    stationName: z.string(),
    stationType: z.null(),
    stationAddr: z.string().nullable(),
    stationLat: z.number(),
    stationLng: z.number(),
    stationNaverRgnCd: z.string(),
    pm10: z.number(),
    pm10Legend: z.string(),
    pm10LegendDesc: z.null(),
    pm10ColorCode: z.string(),
    pm10TextColorCode: z.string(),
    pm25: z.number(),
    pm25Legend: z.string(),
    pm25LegendDesc: z.null(),
    pm25ColorCode: z.string(),
    pm25Exist: z.boolean(),
    pm25TextColorCode: z.string(),
    o3: z.number(),
    o3Legend: z.null(),
    o3ColorCode: z.null(),
    o3LegendDesc: z.null(),
    khai: z.number(),
    khaiLegend: z.null(),
    khaiLegendDesc: z.null(),
    khaiColorCode: z.null(),
  }),
  cachedTime: z.string(),
  expiredTime: z.string(),
})

export type WeatherSchema = z.infer<typeof weatherResponseSchema>

export type WeatherShortTermForecast =
  WeatherSchema['shortTermForecasts'][number]

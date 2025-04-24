import { z } from 'zod'
import { Geocode } from './getGeolocationData'
import { DEFAULT_HEADERS } from '@/constants'

type Params = {
  mappingId: Geocode['code']['mappingId']
}

const schema = z.object({
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
    stationAddr: z.string(),
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

type Schema = z.infer<typeof schema>

export type Weather = Pick<Schema, 'halfdayForecast' | 'shortTermForecasts'>

export async function getWeatherData(
  { mappingId }: Params,
  fetchWeatherData = fetch
) {
  const url = new URL(`${process.env.API_URL}/api/weather/today/${mappingId}`)
  const response = await fetchWeatherData(url, {
    headers: DEFAULT_HEADERS,
  })
  const data = await response.json()
  const { halfdayForecast, shortTermForecasts } = schema.parse(data)

  return { halfdayForecast, shortTermForecasts }
}

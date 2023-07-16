import { THEME_STATE } from '@/constants'
import { z } from 'zod'

export const schema = z.object({
  geo: z.object({
    name: z.string(),
    code: z.object({ id: z.string(), type: z.string(), mappingId: z.string() }),
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
    address: z.string(),
  }),
  weather: z.object({
    today: z.object({
      weatherCode: z.string(),
      weatherText: z.string(),
      temperature: z.number(),
      compareTemperature: z.number(),
      humidity: z.number(),
      stmpr: z.number(),
      windDirection: z.string(),
      windSpeed: z.number(),
      oneHourRainAmt: z.number(),
      rainAmount: z.number(),
      pm10: z.number(),
      pm10Legend: z.string(),
      pm25: z.number(),
      pm25Legend: z.string(),
      o3: z.number(),
      o3Legend: z.string(),
      minTemperature: z.number(),
      maxTemperature: z.number(),
    }),
    weekly: z.array(
      z.object({
        date: z.string(),
        minTemperature: z.number(),
        maxTemperature: z.number(),
        weatherCode: z.string(),
        weatherLegend: z.string(),
      })
    ),
    detailUrl: z.string(),
    observeYmdt: z.string(),
  }),
  theme: z.enum([THEME_STATE.DARK, THEME_STATE.LIGHT]),
})

async function getWeatherInfo() {
  const response = await fetch('/api/weather')
  const data = await response.json()

  return schema.parse(data)
}

export default getWeatherInfo

import { z } from 'zod'

type Params = {
  coords: string
  address: string
}

const schema = z.object({
  address: z.object({
    isRoadAddress: z.boolean(),
    isJibunAddress: z.boolean(),
    address: z.string(),
    mappedAddress: z.null(),
    zipCode: z.null(),
    buildName: z.null(),
    rCode: z.string(),
    x: z.string(),
    y: z.string(),
  }),
  recommendPlace: z.array(
    z.union([
      z.object({
        index: z.string(),
        id: z.string(),
        name: z.string(),
        tel: z.string(),
        category: z.array(z.string()),
        address: z.string(),
        roadAddress: z.string(),
        context: z.array(z.string()),
        x: z.string(),
        y: z.string(),
        description: z.string(),
        thumUrl: z.string(),
        reviewCount: z.number(),
        microReview: z.array(z.string()),
      }),
      z.object({
        index: z.string(),
        id: z.string(),
        name: z.string(),
        tel: z.string(),
        category: z.array(z.string()),
        address: z.string(),
        roadAddress: z.string(),
        context: z.array(z.unknown()),
        x: z.string(),
        y: z.string(),
        description: z.string(),
        thumUrl: z.string(),
        reviewCount: z.number(),
        microReview: z.array(z.unknown()),
      }),
      z.object({
        index: z.string(),
        id: z.string(),
        name: z.string(),
        tel: z.string(),
        category: z.array(z.string()),
        address: z.string(),
        roadAddress: z.string(),
        context: z.array(z.string()),
        x: z.string(),
        y: z.string(),
        description: z.string(),
        thumUrl: z.string(),
        reviewCount: z.number(),
        microReview: z.array(z.unknown()),
      }),
      z.object({
        index: z.string(),
        id: z.string(),
        name: z.string(),
        tel: z.string(),
        category: z.array(z.string()),
        address: z.string(),
        roadAddress: z.string(),
        context: z.array(z.unknown()),
        x: z.string(),
        y: z.string(),
        description: z.string(),
        thumUrl: z.string(),
        reviewCount: z.number(),
        microReview: z.array(z.string()),
      }),
    ])
  ),
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
})

export async function getWeatherData({ coords, address }: Params) {
  const url = new URL(`${process.env.API_URL}/api/addresses/${coords}`)
  url.searchParams.set('address', address)
  url.searchParams.set('lang', 'ko')
  const response = await fetch(url)
  const data = await response.json()
  const { weather } = schema.parse(data)

  return weather
}

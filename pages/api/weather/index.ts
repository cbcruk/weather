import { NextApiRequest, NextApiResponse } from 'next'
import { getGeolocationData } from '@/helper/getGeolocationData'
import { getWeatherData } from '@/helper/getWeatherData'

export async function getData({
  latitude,
  longitude,
}: Pick<GeolocationCoordinates, 'latitude' | 'longitude'>) {
  const coords = [longitude, latitude].join(',')
  const geo = await getGeolocationData(coords)
  const weather = await getWeatherData({ mappingId: geo.code.mappingId })

  return {
    geo,
    weather,
  }
}

async function weather(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { latitude, longitude, theme } = req.query
    const { geo, weather } = await getData({
      latitude: parseFloat(latitude as string),
      longitude: parseFloat(longitude as string),
    })

    if (weather) {
      res.setHeader('Cache-Control', `s-maxage=${60 * 60}`)
      res.json({
        geo,
        weather,
        theme,
      })
    } else {
      res.end()
    }
  } catch (error) {
    console.error(error)
  }
}

export default weather

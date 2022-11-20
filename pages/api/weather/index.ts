import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'
import { GeocodeResponse } from '../../../types/geocode'

async function getGeo(coords: string) {
  const {
    data: { results },
  } = await axios.get<GeocodeResponse>(`${process.env.API_URL}/api/geocode`, {
    params: {
      request: 'coordsToaddr',
      version: '1.0',
      sourcecrs: 'epsg:4326',
      output: 'json',
      orders: 'legalcode',
      coords,
    },
  })
  const [geo] = results
  const address = Object.values(geo.region)
    .slice(1, 4)
    .map((area) => area.name)
    .join(' ')

  return { ...geo, address }
}

type GetWeatherParams = {
  coords: string
  address: string
}

async function getWeather({ coords, address }: GetWeatherParams) {
  const {
    data: { weather },
  } = await axios.get(`${process.env.API_URL}/api/addresses/${coords}`, {
    params: {
      address,
      lang: 'ko',
    },
  })

  return weather
}

export async function getData({
  latitude,
  longitude,
}: Partial<GeolocationCoordinates>) {
  const coords = [longitude, latitude].join(',')
  const geo = await getGeo(coords)
  const weather = await getWeather({ coords, address: geo.address })

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

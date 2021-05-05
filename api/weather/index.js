import axios from 'axios'

async function getGeo(coords) {
  const {
    data: { results },
  } = await axios.get(`${process.env.API_URL}/api/geocode`, {
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

async function getWeather({ coords, address }) {
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

async function weather(req, res) {
  try {
    const { lat, lng } = req.query
    const coords = [lng, lat].join(',')
    const geo = await getGeo(coords)
    const weather = await getWeather({ coords, address: geo.address })

    res.json({
      geo,
      weather,
    })
  } catch (error) {
    console.error(error)
  }
}

export default weather

import getRegionCodeByCoords from './helper/getRegionCodeByCoords'
import getWeatherInfo from './helper/getWeatherInfo'

async function weather(req, res) {
  const { lat, lng } = req.query
  const regionCode = await getRegionCodeByCoords({ lat, lng })
  const weatherInfo = await getWeatherInfo(regionCode)

  res.json(weatherInfo)
}

export default weather

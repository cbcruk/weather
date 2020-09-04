import fetch from 'node-fetch'
import parseHtml from './parseHtml'
import queryWeatherInfo from './queryWeatherInfo'

async function getWeatherInfo(regionCode) {
  const response = await fetch(
    `https://n.weather.naver.com/today/${regionCode}`
  )
  const html = await response.text()
  const document = parseHtml(html)
  const weatherInfo = queryWeatherInfo(document)

  return weatherInfo
}

export default getWeatherInfo

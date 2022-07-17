async function getWeatherInfo() {
  const response = await fetch('/api/weather')
  const data = await response.json()

  return data
}

export default getWeatherInfo

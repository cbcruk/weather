async function getWeatherInfo({ latitude, longitude }) {
  const response = await fetch(`/api/weather?lat=${latitude}&lng=${longitude}`)
  const data = await response.json()

  return data
}

export default getWeatherInfo

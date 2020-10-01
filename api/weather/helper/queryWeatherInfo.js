function toInteger(element) {
  return parseInt(element.textContent.replace(/\D/g, ''), 10)
}

function queryWeatherInfo(document) {
  const weatherArea = document.querySelector('.today_weather')
  const weeklyArea = document.querySelector('#weekly')
  const locationName = document.querySelector('.location_name')
  const [current, sensibleTemperature, rainfall] = [
    weatherArea.querySelector('.current'),
    weatherArea.querySelector('.desc_feeling'),
    weatherArea.querySelector('.desc_rainfall'),
  ].map((element) => toInteger(element))
  const { childNodes: temperatureNodes } = weeklyArea.querySelector(
    '.today .temperature'
  )
  const [location, summary, status] = [
    locationName,
    weatherArea.querySelector('.summary'),
    weatherArea.querySelector('.weather'),
  ].map((element) => element.textContent.trim())
  const iconElement = weatherArea.querySelector('.ico')
  const icon = iconElement.dataset.ico
  const isNight = iconElement.classList.contains('night')

  return {
    location,
    current,
    lowestTemperature: toInteger(temperatureNodes[1]),
    highestTemperature: toInteger(temperatureNodes[4]),
    sensibleTemperature,
    summary,
    status,
    rainfall,
    icon,
    isNight,
  }
}

export default queryWeatherInfo

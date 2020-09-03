function queryWeatherInfo(document) {
  const weatherArea = document.querySelector('.today_weather')
  const locationName = document.querySelector('.location_name')
  const [
    current,
    highestTemperature,
    lowestTemperature,
    sensibleTemperature,
    rainfall
  ] = [
    weatherArea.querySelector('.current'),
    weatherArea.querySelector('.degree_height'),
    weatherArea.querySelector('.degree_low'),
    weatherArea.querySelector('.degree_feel'),
    weatherArea.querySelector('.link_rainfall')
  ].map((element) => parseInt(element.textContent.replace(/\D/g, ''), 10))
  const [location, summary, status] = [
    locationName,
    weatherArea.querySelector('.summary').childNodes[0],
    weatherArea.querySelector('.weather')
  ].map((element) => element.textContent.trim())
  const iconElement = weatherArea.querySelector('.ico')
  const icon = iconElement.dataset.ico
  const isNight = iconElement.classList.contains('night')

  return {
    location,
    current,
    highestTemperature,
    lowestTemperature,
    sensibleTemperature,
    summary,
    status,
    rainfall,
    icon,
    isNight
  }
}

export default queryWeatherInfo

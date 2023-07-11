function getFormattedTemperature(temp: number) {
  if (temp > 0) {
    return `어제보다 ${temp}° 높아요`
  } else if (temp < 0) {
    return `어제보다 ${temp}° 낮아요`
  } else {
    return '어제 기온과 같아요'
  }
}

export default getFormattedTemperature

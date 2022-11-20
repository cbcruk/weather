function getFormattedTemperature(temp: string) {
  const parsed = parseFloat(temp)

  if (parsed > 0) {
    return `어제보다 ${parsed}° 높아요`
  } else if (parsed < 0) {
    return `어제보다 ${parsed}° 낮아요`
  } else {
    return '어제 기온과 같아요'
  }
}

export default getFormattedTemperature

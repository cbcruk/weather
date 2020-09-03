async function getRegionCodeByCoords({ latitude, longitude }) {
  const response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://n.weather.naver.com/api/naverRgnCatForCoords?lat=${latitude}&lng=${longitude}`
  )
  const { regionCode } = await response.json()

  return regionCode
}

export default getRegionCodeByCoords

import fetch from 'node-fetch'

async function getRegionCodeByCoords({ lat, lng }) {
  const response = await fetch(
    `https://n.weather.naver.com/api/naverRgnCatForCoords?lat=${lat}&lng=${lng}`
  )
  const { regionCode } = await response.json()

  return regionCode
}

export default getRegionCodeByCoords

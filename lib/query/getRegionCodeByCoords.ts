import axios from 'axios'

async function getRegionCodeByCoords({
  latitude,
  longitude,
}: Partial<GeolocationCoordinates>) {
  const { data } = await axios.get(
    `https://n.weather.naver.com/api/naverRgnCatForCoords?lat=${latitude}&lng=${longitude}`
  )

  return data.regionCode
}

export default getRegionCodeByCoords

import axios from 'axios'

async function getRegionCodeByCoords({ lat, lng }) {
  const { data } = await axios.get(
    `https://n.weather.naver.com/api/naverRgnCatForCoords?lat=${lat}&lng=${lng}`
  )

  return data.regionCode
}

export default getRegionCodeByCoords

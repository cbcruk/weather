import { getDocument } from '@cbcruk/dom'
import { NextApiRequest, NextApiResponse } from 'next'
import getCity from '../../lib/query/getCity'
import getCurrent from '../../lib/query/getCurrent'
import getHourly from '../../lib/query/getHourly'
import getRegionCodeByCoords from '../../lib/query/getRegionCodeByCoords'

async function weather(req: NextApiRequest, res: NextApiResponse) {
  const { lat, lng } = req.query
  const regionCode = await getRegionCodeByCoords({ lat, lng })
  const document = await getDocument(
    `https://n.weather.naver.com/today/${regionCode}`
  )
  const current = getCurrent(document)
  const hourly = getHourly(document)
  const city = getCity(document)

  res.json({
    current,
    hourly,
    city: {
      ...city,
      coord: req.query,
    },
  })
}

export default weather

import { atom } from 'jotai'
import sunCalc from 'suncalc'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import { coordsAtom } from './coords'

dayjs.extend(isSameOrAfter)

const sunCalcAtom = atom((get) => {
  const coords = get(coordsAtom)

  return sunCalc.getTimes(new Date(), coords.latitude, coords.longitude)
})

export const nightAtom = atom((get) => {
  const result = get(sunCalcAtom)
  const isNight = dayjs().isSameOrAfter(dayjs(result.sunset))

  return isNight
})

import { atom } from 'jotai'
import sunCalc from 'suncalc'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import { coordsAtom } from './coords'

dayjs.extend(isSameOrAfter)

const sunCalcAtom = atom((get) => {
  const { latitude, longitude } = get(coordsAtom)

  return sunCalc.getTimes(new Date(), latitude, longitude)
})

export const nightAtom = atom((get) => {
  const sunset = get(sunCalcAtom)
  const isNight = dayjs().isSameOrAfter(dayjs(sunset))

  return isNight
})

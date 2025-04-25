import { TIME_STATE } from '@/constants'
import { getTimezoneDate } from '@/helper/getTimezoneDate'
import { QueryClient } from '@tanstack/react-query'
import { cache } from 'react'

export const getQueryClient = cache(() => new QueryClient())

export function getTimeState(date?: Date) {
  const tzDate = getTimezoneDate(date)
  const currentHour = tzDate.hour()

  if (currentHour >= 0 && currentHour < 6) {
    return TIME_STATE.새벽
  } else if (currentHour >= 6 && currentHour < 11) {
    return TIME_STATE.아침
  } else if (currentHour >= 11 && currentHour < 17) {
    return TIME_STATE.낮
  } else if (currentHour >= 17 && currentHour < 21) {
    return TIME_STATE.저녁
  } else {
    return TIME_STATE.밤
  }
}

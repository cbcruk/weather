import { QueryClient } from '@tanstack/react-query'
import { cache } from 'react'

export const getQueryClient = cache(() => new QueryClient())

export function getTimeState() {
  const currentTime = new Date()
  const currentHour = currentTime.getHours()

  if (currentHour >= 0 && currentHour < 6) {
    return '새벽'
  } else if (currentHour >= 6 && currentHour < 11) {
    return '아침'
  } else if (currentHour >= 11 && currentHour < 17) {
    return '낮'
  } else if (currentHour >= 17 && currentHour < 21) {
    return '저녁'
  } else {
    return '밤'
  }
}

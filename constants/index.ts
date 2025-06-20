export const THEME_STATE = {
  DARK: 'DARK',
  LIGHT: 'LIGHT',
} as const

export const SUNSET_STATE = {
  morning: 'morning',
  afternoon: 'afternoon',
  night: 'night',
} as const

export const TIME_STATE = {
  새벽: '새벽',
  아침: '아침',
  낮: '낮',
  저녁: '저녁',
  밤: '밤',
} as const

export const COOKIES = {
  COORDS: 'COORDS',
} as const

export const DEFAULT_COORDS = {
  latitude: 37.5642135,
  longitude: 127.0016985,
}

export const DEFAULT_HEADERS = new Headers([
  ['Referer', 'https://map.naver.com/p/'],
])

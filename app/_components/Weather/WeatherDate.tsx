import 'dayjs/locale/ko'
import dayjs from 'dayjs'
import { getTimezoneDate } from '@/helper/getTimezoneDate'

dayjs.locale('ko')

/**
 * 서버에서도 렌더되는 컴포넌트라 시간대를 고정하지 않으면 배포 서버의
 * 시간대로 날짜가 찍힌다. 이 앱의 나머지(테마, 일몰, 시간대)와 같은
 * 기준을 쓰도록 Asia/Seoul 로 맞춘다.
 */
function getFormattedDate() {
  const result = getTimezoneDate().format('dddd—M월D일')

  return result
}

export function WeatherDate() {
  return <div className="mt-3.5">{getFormattedDate()}</div>
}

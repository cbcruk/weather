import dayjs from 'dayjs'
import 'dayjs/locale/ko'

dayjs.locale('ko')

function getFormattedDate() {
  const result = dayjs().format('dddd—M월D일')

  return result
}

export function WeatherDate() {
  return <div className="mt-3.5">{getFormattedDate()}</div>
}

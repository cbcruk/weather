import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import * as styles from './style'

dayjs.locale('ko')

function getFormattedDate() {
  const result = dayjs().format('dddd—M월D일')

  return result
}

export function WeatherDate() {
  return <div className={styles.date}>{getFormattedDate()}</div>
}

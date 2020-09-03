import dayjs from 'dayjs'
import 'dayjs/locale/ko'

function getFormattedDate() {
  dayjs.locale('ko')

  const result = dayjs().format('dddd—MMMDDdd')

  return result
}

export default getFormattedDate

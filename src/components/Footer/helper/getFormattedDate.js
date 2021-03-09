import dayjs from 'dayjs'
import 'dayjs/locale/ko'

dayjs.locale('ko')

function getFormattedDate() {
  const result = dayjs().format('dddd—M월d일')

  return result
}

export default getFormattedDate

import dayjs from 'dayjs'
import 'dayjs/locale/ko'

dayjs.locale('ko')

type Props = {
  staleAt: number
}

/**
 * 지금 보이는 값이 실시간이 아니라는 것을 알린다.
 * 낡은 기온을 현재 기온처럼 보여주면 없느니만 못하다.
 */
export function WeatherStaleNotice({ staleAt }: Props) {
  const at = dayjs(staleAt)

  return (
    <p role="status" className="mt-2 text-sm opacity-70">
      최신 정보를 불러오지 못해{' '}
      <time dateTime={at.toISOString()}>{at.format('M월 D일 HH:mm')}</time> 기준
      정보를 보여주고 있어요
    </p>
  )
}

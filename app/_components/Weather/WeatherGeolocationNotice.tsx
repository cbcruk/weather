import { GeolocationError } from '@/helper/errors'

type Props = {
  isPending: boolean
  error: Error | null
}

/** 권한 거부는 다시 눌러도 그대로라서, 무엇을 해야 풀리는지까지 알려준다. */
function describe(error: Error) {
  if (!(error instanceof GeolocationError)) {
    return '위치 정보를 가져오지 못했어요'
  }

  return error.code === 1
    ? `${error.reason}. 브라우저에서 위치 권한을 허용한 뒤 다시 눌러주세요`
    : `${error.reason}. 잠시 뒤 다시 눌러주세요`
}

/**
 * 버튼 아이콘의 변화만으로는 기다리는 중인지 실패한 것인지 구분되지 않는다.
 * 특히 권한 거부는 화면이 영원히 그대로여서 말로 알리지 않으면 고장으로 읽힌다.
 */
export function WeatherGeolocationNotice({ isPending, error }: Props) {
  if (isPending) {
    return (
      <p role="status" className="mt-2 text-sm opacity-70">
        현재 위치를 확인하고 있어요
      </p>
    )
  }

  if (!error) {
    return null
  }

  return (
    <p role="alert" className="mt-2 text-sm opacity-70">
      {describe(error)}
    </p>
  )
}

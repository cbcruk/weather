type Props = {
  isPending: boolean
  onRefresh: () => void
}

export function WeatherGeolocationButton({ isPending, onRefresh }: Props) {
  return (
    <button
      type="button"
      className="cursor-pointer disabled:cursor-progress"
      // 아이콘만 있는 버튼이라 이름을 직접 달지 않으면 무엇을 누르는지 읽어줄 수 없다.
      aria-label={
        isPending ? '현재 위치를 확인하는 중' : '현재 위치로 다시 불러오기'
      }
      aria-busy={isPending}
      disabled={isPending}
      onClick={(e) => {
        e.stopPropagation()
        onRefresh()
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        fill="currentColor"
        className={
          isPending ? 'opacity-60 motion-safe:animate-pulse' : undefined
        }
      >
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
      </svg>
    </button>
  )
}

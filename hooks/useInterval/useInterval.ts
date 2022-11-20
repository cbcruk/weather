import { useEffect, useRef } from 'react'

type Fn = () => void

function useInterval(callback: Fn, delay: number) {
  const savedCallback = useRef<Fn>()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    function tick() {
      savedCallback.current && savedCallback.current()
    }

    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

export default useInterval

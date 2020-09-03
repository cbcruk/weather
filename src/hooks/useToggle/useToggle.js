import { useState, useCallback } from 'react'

function useToggle() {
  const [state, setState] = useState(false)
  const toggle = useCallback(() => setState(!state), [state])
  const updateSelected = useCallback((value) => setState(value), [])

  return {
    state,
    toggle,
    updateSelected,
  }
}

export default useToggle

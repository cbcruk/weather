import { useReducer, useEffect } from 'react'
import { getGeolocation, getRegionCodeByCoords } from '../../helper'

function reducer(state, action) {
  switch (action.type) {
    case 'request':
      return {
        ...state,
        status: action.type,
      }
    case 'success':
      return {
        ...state,
        status: action.type,
        regionCode: action.payload.regionCode,
        coords: action.payload.coords,
      }
    case 'failure':
      return {
        ...state,
        status: action.type,
        error: action.payload,
      }
    default:
      return state
  }
}

function useGeolocation() {
  const [state, dispatch] = useReducer(reducer, {
    coords: null,
    regionCode: null,
    status: 'idle',
  })

  async function handleGeolocationCallback() {
    dispatch({
      type: 'request',
    })

    try {
      const coords = await getGeolocation()
      const regionCode = await getRegionCodeByCoords(coords)

      dispatch({
        type: 'success',
        payload: {
          coords,
          regionCode,
        },
      })
    } catch (error) {
      dispatch({
        type: 'failure',
        payload: error,
      })
    }
  }

  useEffect(() => {
    handleGeolocationCallback()
  }, [])

  return {
    state,
    regionCode: state.regionCode,
    handleGeolocationCallback,
  }
}

export default useGeolocation

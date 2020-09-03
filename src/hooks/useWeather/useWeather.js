import { useReducer, useEffect, useCallback } from 'react'
import { getWeatherInfo } from '../../helper'
import useInterval from '../useInterval'

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
        data: action.payload,
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

function useWeather(regionCode) {
  const [state, dispatch] = useReducer(reducer, {
    status: 'idle',
    data: null,
  })

  const handleWeatherCallback = useCallback(async () => {
    if (!regionCode) {
      return
    }

    dispatch({
      type: 'request',
    })

    try {
      const data = await getWeatherInfo(regionCode)

      dispatch({
        type: 'success',
        payload: data,
      })
    } catch (error) {
      dispatch({
        type: 'failure',
        payload: error,
      })
    }
  }, [regionCode])

  useEffect(() => {
    handleWeatherCallback()
  }, [handleWeatherCallback, regionCode])

  useInterval(() => {
    handleWeatherCallback()
  }, 1000 * 60)

  return { state }
}

export default useWeather

'use client'

import { useState, useEffect } from 'react'
import { parseSVG, type ParsedSVGResult } from '../utils'

type UseSVGParserResult = {
  data: ParsedSVGResult | null
  isLoading: boolean
  error: Error | null
}

const cache = new Map<string, ParsedSVGResult>()

export function useSVGParser(iconNumber: string): UseSVGParserResult {
  const [data, setData] = useState<ParsedSVGResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const cacheKey = iconNumber

    if (cache.has(cacheKey)) {
      setData(cache.get(cacheKey)!)
      setIsLoading(false)
      return
    }

    const fetchAndParse = async (): Promise<void> => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/icons/ico_animation_wt${iconNumber}.svg`)
        if (!response.ok) {
          throw new Error(`Failed to fetch SVG: ${response.status}`)
        }

        const svgString = await response.text()
        const parsed = parseSVG(svgString)

        cache.set(cacheKey, parsed)
        setData(parsed)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchAndParse()
  }, [iconNumber])

  return { data, isLoading, error }
}

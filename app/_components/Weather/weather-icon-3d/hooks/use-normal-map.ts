'use client'

import { useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import {
  renderShapeToCanvas,
  alphaToHeightMap,
  blurHeightMap,
  heightToNormalMap,
  canvasToTexture,
} from '../utils'

type UseNormalMapParams = {
  pathD: string
  texSize?: number
  blurRadius?: number
  blurPasses?: number
  normalStrength?: number
  fill?: string
  opacity?: number
  viewBox?: [number, number, number, number]
  transform?: { x: number; y: number }
}

type UseNormalMapResult = {
  normalTexture: THREE.CanvasTexture | null
  diffuseTexture: THREE.CanvasTexture | null
  isReady: boolean
}

const normalMapCache = new Map<string, THREE.CanvasTexture>()
const diffuseCache = new Map<string, THREE.CanvasTexture>()

function createCacheKey(params: UseNormalMapParams): string {
  return `${params.pathD}_${params.texSize}_${params.blurRadius}_${params.blurPasses}_${params.normalStrength}`
}

function createDiffuseCanvas(
  pathD: string,
  texSize: number,
  fill: string,
  opacity: number,
  scale: number,
  offset: { x: number; y: number }
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = texSize
  canvas.height = texSize
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Failed to get 2D context')
  }

  ctx.save()
  ctx.scale(scale, scale)
  ctx.translate(offset.x, offset.y)
  ctx.globalAlpha = opacity
  ctx.fillStyle = fill
  ctx.fill(new Path2D(pathD))
  ctx.restore()

  return canvas
}

export function useNormalMap(params: UseNormalMapParams): UseNormalMapResult {
  const {
    pathD,
    texSize = 512,
    blurRadius = 5,
    blurPasses = 10,
    normalStrength = 1.2,
    fill = '#ffffff',
    opacity = 1,
    viewBox = [0, 0, 176, 176],
    transform = { x: 0, y: 0 },
  } = params

  const scale = texSize / viewBox[2]
  const offsetX = -viewBox[0] + transform.x
  const offsetY = -viewBox[1] + transform.y

  const [normalTexture, setNormalTexture] = useState<THREE.CanvasTexture | null>(
    null
  )
  const [diffuseTexture, setDiffuseTexture] = useState<THREE.CanvasTexture | null>(
    null
  )
  const [isReady, setIsReady] = useState(false)

  const cacheKey = useMemo(
    () => createCacheKey(params),
    [pathD, texSize, blurRadius, blurPasses, normalStrength]
  )

  useEffect(() => {
    if (!pathD) {
      setIsReady(false)
      return
    }

    const cachedNormal = normalMapCache.get(cacheKey)
    const cachedDiffuse = diffuseCache.get(cacheKey)

    if (cachedNormal && cachedDiffuse) {
      setNormalTexture(cachedNormal)
      setDiffuseTexture(cachedDiffuse)
      setIsReady(true)
      return
    }

    const generate = (): void => {
      try {
        const offset = { x: offsetX, y: offsetY }

        const shapeCanvas = renderShapeToCanvas({
          pathD,
          offset,
          scale,
          texSize,
        })

        const rawHeight = alphaToHeightMap(shapeCanvas)
        const smoothHeight = blurHeightMap(rawHeight, texSize, texSize, {
          radius: blurRadius,
          passes: blurPasses,
        })

        const normalCanvas = heightToNormalMap(smoothHeight, texSize, texSize, {
          strength: normalStrength,
        })

        const normalTex = canvasToTexture(normalCanvas)
        const diffuseCanvas = createDiffuseCanvas(pathD, texSize, fill, opacity, scale, offset)
        const diffuseTex = canvasToTexture(diffuseCanvas)

        normalMapCache.set(cacheKey, normalTex)
        diffuseCache.set(cacheKey, diffuseTex)

        setNormalTexture(normalTex)
        setDiffuseTexture(diffuseTex)
        setIsReady(true)
      } catch (err) {
        console.error('Failed to generate normal map:', err)
        setIsReady(false)
      }
    }

    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(generate)
    } else {
      setTimeout(generate, 0)
    }
  }, [cacheKey, pathD, texSize, blurRadius, blurPasses, normalStrength, fill, opacity, scale, offsetX, offsetY])

  return { normalTexture, diffuseTexture, isReady }
}

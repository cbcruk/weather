export function alphaToHeightMap(canvas: HTMLCanvasElement): Float32Array {
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Failed to get 2D context')
  }

  const { width, height } = canvas
  const pixels = ctx.getImageData(0, 0, width, height).data

  const heightMap = new Float32Array(width * height)
  for (let i = 0; i < width * height; i++) {
    heightMap[i] = pixels[i * 4 + 3] / 255
  }

  return heightMap
}

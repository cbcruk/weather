type RenderShapeToCanvasParams = {
  pathD: string
  offset: { x: number; y: number }
  scale: number
  texSize: number
}

export function renderShapeToCanvas({
  pathD,
  offset,
  scale,
  texSize,
}: RenderShapeToCanvasParams): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = texSize
  canvas.height = texSize
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Failed to get 2D context')
  }

  ctx.save()
  ctx.translate(offset.x * scale, offset.y * scale)
  ctx.scale(scale, scale)
  ctx.fillStyle = '#ffffff'
  ctx.fill(new Path2D(pathD))
  ctx.restore()

  return canvas
}

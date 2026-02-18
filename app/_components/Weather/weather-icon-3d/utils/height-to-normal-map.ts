type NormalMapConfig = {
  strength: number
}

export function heightToNormalMap(
  heightMap: Float32Array,
  width: number,
  height: number,
  config: NormalMapConfig = { strength: 1.2 }
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Failed to get 2D context')
  }

  const imageData = ctx.createImageData(width, height)
  const { strength } = config

  const h = (x: number, y: number): number =>
    heightMap[
      Math.min(Math.max(y, 0), height - 1) * width +
        Math.min(Math.max(x, 0), width - 1)
    ]

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const centerHeight = h(x, y)
      const i4 = (y * width + x) * 4

      if (centerHeight < 0.01) {
        imageData.data[i4] = 128
        imageData.data[i4 + 1] = 128
        imageData.data[i4 + 2] = 255
        imageData.data[i4 + 3] = 255
        continue
      }

      const tl = h(x - 1, y - 1)
      const tm = h(x, y - 1)
      const tr = h(x + 1, y - 1)
      const ml = h(x - 1, y)
      const mr = h(x + 1, y)
      const bl = h(x - 1, y + 1)
      const bm = h(x, y + 1)
      const br = h(x + 1, y + 1)

      const dX = tr + 2 * mr + br - (tl + 2 * ml + bl)
      const dY = bl + 2 * bm + br - (tl + 2 * tm + tr)

      const localStrength = strength * Math.min(centerHeight * 2, 1.0)

      let nx = -dX * localStrength
      let ny = -dY * localStrength
      let nz = 1.0

      const len = Math.sqrt(nx * nx + ny * ny + nz * nz)
      nx /= len
      ny /= len
      nz /= len

      imageData.data[i4] = ((nx * 0.5 + 0.5) * 255) | 0
      imageData.data[i4 + 1] = ((ny * 0.5 + 0.5) * 255) | 0
      imageData.data[i4 + 2] = ((nz * 0.5 + 0.5) * 255) | 0
      imageData.data[i4 + 3] = 255
    }
  }

  ctx.putImageData(imageData, 0, 0)
  return canvas
}

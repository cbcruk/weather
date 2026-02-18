export function boxBlur(
  src: Float32Array,
  width: number,
  height: number,
  radius: number
): Float32Array {
  const dst = new Float32Array(src.length)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0
      let count = 0

      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = Math.min(Math.max(x + dx, 0), width - 1)
          const ny = Math.min(Math.max(y + dy, 0), height - 1)
          sum += src[ny * width + nx]
          count++
        }
      }

      dst[y * width + x] = sum / count
    }
  }

  return dst
}

type BlurConfig = {
  radius: number
  passes: number
}

export function blurHeightMap(
  heightMap: Float32Array,
  width: number,
  height: number,
  config: BlurConfig
): Float32Array {
  let result = heightMap

  for (let i = 0; i < config.passes; i++) {
    result = boxBlur(result, width, height, config.radius)
  }

  return result
}

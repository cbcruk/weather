import * as THREE from 'three'

export function canvasToTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Suspense } from 'react'
import { Fallback } from '../models/fallback'
import type { WeatherCanvasProps } from '../weather-icon-3d.types'

export function WeatherCanvas({
  enableInteraction = true,
  className,
}: WeatherCanvasProps): React.ReactElement {
  return (
    <div
      className={className}
      style={{ width: '100%', height: '100%', minHeight: 200 }}
    >
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 3]} fov={50} />
        {enableInteraction && (
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={2}
            maxDistance={8}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
          />
        )}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <directionalLight position={[-3, -3, -3]} intensity={0.3} />
        <Suspense fallback={null}>
          <Fallback />
        </Suspense>
      </Canvas>
    </div>
  )
}

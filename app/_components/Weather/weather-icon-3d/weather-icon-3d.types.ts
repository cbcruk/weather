export type RenderMode = 'extrude' | 'shader' | 'spheres'

export type WeatherIcon3DProps = {
  code: string
  isNight: boolean
  mode?: RenderMode
  enableInteraction?: boolean
  className?: string
}

export type WeatherCanvasProps = {
  iconNumber: string
  mode?: RenderMode
  enableInteraction?: boolean
  className?: string
}

export type WeatherSceneProps = {
  iconNumber: string
  mode?: RenderMode
}

export type ParsedSVGElement =
  | { type: 'path'; d: string; fill?: string; id?: string }
  | { type: 'circle'; cx: number; cy: number; r: number; fill?: string; id?: string }
  | { type: 'ellipse'; cx: number; cy: number; rx: number; ry: number; fill?: string; id?: string }

export type ParsedSVG = {
  elements: ParsedSVGElement[]
  viewBox: [number, number, number, number]
}

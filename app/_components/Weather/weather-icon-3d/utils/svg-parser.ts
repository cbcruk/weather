export type GradientStop = {
  offset: number
  color: string
  opacity: number
}

export type GradientInfo = {
  id: string
  type: 'linear' | 'radial'
  stops: GradientStop[]
  x1?: string
  y1?: string
  x2?: string
  y2?: string
}

export type ParsedSVGLayer = {
  id: string
  type: 'path' | 'circle' | 'ellipse'
  pathD: string
  fill: string
  opacity: number
  transform?: { x: number; y: number }
}

export type ParsedSVGResult = {
  layers: ParsedSVGLayer[]
  viewBox: [number, number, number, number]
  gradients: Record<string, GradientInfo>
  width: number
  height: number
}

export function circleToPath(cx: number, cy: number, r: number): string {
  return `M ${cx - r},${cy} a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0`
}

export function ellipseToPath(
  cx: number,
  cy: number,
  rx: number,
  ry: number
): string {
  return `M ${cx - rx},${cy} a ${rx},${ry} 0 1,0 ${rx * 2},0 a ${rx},${ry} 0 1,0 -${rx * 2},0`
}

function parseGradients(doc: Document): Record<string, GradientInfo> {
  const gradients: Record<string, GradientInfo> = {}

  const linearGrads = doc.querySelectorAll('linearGradient')
  linearGrads.forEach((grad) => {
    const id = grad.getAttribute('id')
    if (!id) return

    const stops: GradientStop[] = []
    grad.querySelectorAll('stop').forEach((stop) => {
      const offsetStr = stop.getAttribute('offset') || '0%'
      const offset = parseFloat(offsetStr) / (offsetStr.includes('%') ? 100 : 1)
      const color = stop.getAttribute('stop-color') || '#000000'
      const opacityStr = stop.getAttribute('stop-opacity')
      const opacity = opacityStr ? parseFloat(opacityStr) : 1

      stops.push({ offset, color, opacity })
    })

    gradients[id] = {
      id,
      type: 'linear',
      stops,
      x1: grad.getAttribute('x1') || '0%',
      y1: grad.getAttribute('y1') || '0%',
      x2: grad.getAttribute('x2') || '100%',
      y2: grad.getAttribute('y2') || '0%',
    }
  })

  const radialGrads = doc.querySelectorAll('radialGradient')
  radialGrads.forEach((grad) => {
    const id = grad.getAttribute('id')
    if (!id) return

    const stops: GradientStop[] = []
    grad.querySelectorAll('stop').forEach((stop) => {
      const offsetStr = stop.getAttribute('offset') || '0%'
      const offset = parseFloat(offsetStr) / (offsetStr.includes('%') ? 100 : 1)
      const color = stop.getAttribute('stop-color') || '#000000'
      const opacityStr = stop.getAttribute('stop-opacity')
      const opacity = opacityStr ? parseFloat(opacityStr) : 1

      stops.push({ offset, color, opacity })
    })

    gradients[id] = {
      id,
      type: 'radial',
      stops,
    }
  })

  return gradients
}

function parseTransform(transformStr: string): { x: number; y: number } {
  const translateMatch = transformStr.match(
    /translate\(\s*([-\d.]+)(?:px)?\s*,?\s*([-\d.]+)?(?:px)?\s*\)/
  )
  if (translateMatch) {
    return {
      x: parseFloat(translateMatch[1]) || 0,
      y: parseFloat(translateMatch[2]) || 0,
    }
  }
  return { x: 0, y: 0 }
}

function resolveFill(fill: string, gradients: Record<string, GradientInfo>): string {
  if (fill.startsWith('url(#')) {
    const gradId = fill.slice(5, -1)
    const grad = gradients[gradId]
    if (grad && grad.stops.length > 0) {
      return grad.stops[0].color
    }
  }
  return fill
}

export function parseSVG(svgString: string): ParsedSVGResult {
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgString, 'image/svg+xml')
  const svg = doc.querySelector('svg')

  if (!svg) {
    throw new Error('Invalid SVG')
  }

  const viewBoxStr = svg.getAttribute('viewBox') || '0 0 176 176'
  const viewBoxParts = viewBoxStr.split(/\s+/).map(Number)
  const viewBox: [number, number, number, number] = [
    viewBoxParts[0] || 0,
    viewBoxParts[1] || 0,
    viewBoxParts[2] || 176,
    viewBoxParts[3] || 176,
  ]

  const width = parseFloat(svg.getAttribute('width') || String(viewBox[2]))
  const height = parseFloat(svg.getAttribute('height') || String(viewBox[3]))

  const gradients = parseGradients(doc)
  const layers: ParsedSVGLayer[] = []

  const processElement = (
    el: Element,
    parentTransform: { x: number; y: number } = { x: 0, y: 0 }
  ): void => {
    const tagName = el.tagName.toLowerCase()
    const id = el.getAttribute('id') || `layer-${layers.length}`
    const fillAttr = el.getAttribute('fill') || '#000000'
    const fill = resolveFill(fillAttr, gradients)
    const opacityAttr = el.getAttribute('opacity')
    const opacity = opacityAttr ? parseFloat(opacityAttr) : 1

    const transformAttr = el.getAttribute('transform') || ''
    const localTransform = parseTransform(transformAttr)
    const transform = {
      x: parentTransform.x + localTransform.x,
      y: parentTransform.y + localTransform.y,
    }

    if (tagName === 'circle') {
      const cx = parseFloat(el.getAttribute('cx') || '0') + transform.x
      const cy = parseFloat(el.getAttribute('cy') || '0') + transform.y
      const r = parseFloat(el.getAttribute('r') || '0')

      layers.push({
        id,
        type: 'circle',
        pathD: circleToPath(cx, cy, r),
        fill,
        opacity,
        transform,
      })
    } else if (tagName === 'ellipse') {
      const cx = parseFloat(el.getAttribute('cx') || '0') + transform.x
      const cy = parseFloat(el.getAttribute('cy') || '0') + transform.y
      const rx = parseFloat(el.getAttribute('rx') || '0')
      const ry = parseFloat(el.getAttribute('ry') || '0')

      layers.push({
        id,
        type: 'ellipse',
        pathD: ellipseToPath(cx, cy, rx, ry),
        fill,
        opacity,
        transform,
      })
    } else if (tagName === 'path') {
      const d = el.getAttribute('d')
      if (d) {
        layers.push({
          id,
          type: 'path',
          pathD: d,
          fill,
          opacity,
          transform,
        })
      }
    } else if (tagName === 'g') {
      Array.from(el.children).forEach((child) => {
        processElement(child, transform)
      })
    }
  }

  Array.from(svg.children).forEach((child) => {
    if (child.tagName.toLowerCase() !== 'defs' && child.tagName.toLowerCase() !== 'style') {
      processElement(child)
    }
  })

  return {
    layers,
    viewBox,
    gradients,
    width,
    height,
  }
}

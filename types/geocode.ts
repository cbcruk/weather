export interface GeocodeResponse {
  status: Status
  results: Result[]
}

export interface Status {
  code: number
  name: string
  message: string
}

export interface Result {
  name: string
  code: Code
  region: Region
}

export interface Code {
  id: string
  type: string
  mappingId: string
}

export interface Region {
  area0: Area0
  area1: Area1
  area2: Area2
  area3: Area3
  area4: Area4
}

export interface Area0 {
  name: string
  coords: Coords
}

export interface Coords {
  center: Center
}

export interface Center {
  crs: string
  x: number
  y: number
}

export interface Area1 {
  name: string
  coords: Coords2
  alias: string
}

export interface Coords2 {
  center: Center2
}

export interface Center2 {
  crs: string
  x: number
  y: number
}

export interface Area2 {
  name: string
  coords: Coords3
}

export interface Coords3 {
  center: Center3
}

export interface Center3 {
  crs: string
  x: number
  y: number
}

export interface Area3 {
  name: string
  coords: Coords4
}

export interface Coords4 {
  center: Center4
}

export interface Center4 {
  crs: string
  x: number
  y: number
}

export interface Area4 {
  name: string
  coords: Coords5
}

export interface Coords5 {
  center: Center5
}

export interface Center5 {
  crs: string
  x: number
  y: number
}

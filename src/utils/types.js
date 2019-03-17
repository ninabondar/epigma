// @flow
export type Point = { x: number, y: number, type: string }
export type Shape = { points: Point[], style: any }

export type Matrix = [number[]]
export type TransformationMatrix = [
  [number, number, 0],
  [number, number, 0],
  [number, number, 1]
]

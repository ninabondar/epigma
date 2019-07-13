// @flow
import {
  init,
  tail,
  slice,
  update,
  remove,
  assoc,
  prop,
  head,
  compose,
  reduce,
  curry
} from "ramda"
import type { Point, Shape } from "./types"
import {
  getTransformMatrix,
  getTransformMatrixWithAsymmetricZoom,
  multiplyManyMatrices
} from "./matrix"

type _serializePoint = Point => string
export const serializePoint: _serializePoint = ({ x, y }) => x + "," + y

type _createPoint = ({ x: number, y: number, type: string }) => Point
export const createPoint: _createPoint = (a, b, type = "L") =>
  typeof a === "object"
    ? {
        x: a.x,
        y: a.y,
        type: a.type || "L"
      }
    : {
        x: a,
        y: b,
        type
      }

type _createShape = Point => Shape
export const createShape: _createShape = (point: Point) => ({
  points: [point],
  style: null
})

type _serializePath = (Point[]) => string
export const serializePath: _serializePath = dotsArr =>
  compose(
    head,
    reduce(
      ([stringPath, prevPoint], point) => {
        if (!prevPoint) return ["M" + point.x + "," + point.y, point]

        if (point.type === "M")
          return [stringPath + "M" + point.x + "," + point.y, point]

        if (point.type === undefined || point.type === "L")
          return [stringPath + "L" + point.x + "," + point.y, point]
      },
      ["", null]
    )
  )(dotsArr)

type _removePoint = (Point[]) => number => Point[]
export const removePoint: _removePoint = (points, index) => {
  if (index === 0) return tail(points)
  if (index === points.length - 1) return init(points)
  if (index === 1) return slice(2, Infinity, points)
  if (index === points.length - 2) return slice(0, points.length - 2, points)

  const nextPoint = assoc("type", "M", points[index + 1])

  return update(index, nextPoint, remove(index, 1, points))
}

type _getBoundingBoxFromShape = Shape => [number, number, number, number]
export const getBoundingBoxFromShape: _getBoundingBoxFromShape = ({
  points
}) => {
  const xs = points.map(prop("x"))
  const ys = points.map(prop("y"))
  return [Math.min(...ys), Math.max(...xs), Math.max(...ys), Math.min(...xs)]
}

export const getZoomMatrix = curry((centerOfCoordinates, zoom) =>
  getZoomMatrixXY(centerOfCoordinates, zoom, zoom)
)

export const getZoomMatrixXY = curry((centerOfCoordinates, zoomX, zoomY) => {
  const { x, y } = centerOfCoordinates

  const shiftFromStart = getTransformMatrix(1, -x, -y)
  const zoomMatrix = getTransformMatrixWithAsymmetricZoom(zoomX, zoomY, 0, 0)
  const unshiftFromStart = getTransformMatrix(1, x, y)

  return multiplyManyMatrices(shiftFromStart, zoomMatrix, unshiftFromStart)
})

const stopEvent = (ev: Event) => {
  ev.stopPropagation()
  if (ev.nativeEvent) ev.nativeEvent.stopImmediatePropagation()
  ev.cancelBubble = true
}

export const stopAllEvents = {
  onMouseMove: stopEvent,
  onMouseUp: stopEvent,
  onMouseDown: stopEvent,

  onWheel: stopEvent,
  onKeyDown: stopEvent,
  onKeyPress: stopEvent
}

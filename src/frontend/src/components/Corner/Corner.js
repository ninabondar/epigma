import React from "react"
import BEM from "../../utils/BEM"
import { compose, withHandlers, withState } from "recompose"

export const CORNER_CONTROL_SIZE = 8
const b = BEM("Selection")

const Corner = ({
  startingPoint,
  updateStartingPoint,
  updateStartingCoord,
  finishDrag,
  cornerCoordinates,
  moveCorner,
  cornerOffset,
  updateOffset,
  ...props
}) => (
  <rect
    onMouseDown={({ pageX: x, pageY: y }) => {
      updateStartingCoord(x, y)
    }}
    onMouseUp={e => {
      finishDrag(e)
    }}
    style={{
      transform: `translate(
        ${CORNER_CONTROL_SIZE / 2}px,
        ${CORNER_CONTROL_SIZE / 2}px
      )`
    }}
    className={b("vertex")}
    width={CORNER_CONTROL_SIZE}
    height={CORNER_CONTROL_SIZE}
    x={cornerCoordinates.x}
    y={cornerCoordinates.y}
    {...props}
  />
)

const enhancer = compose(
  withState("startingPoint", "updateStartingPoint", { x: 0, y: 0 }),
  withState("cornerCoordinates", "moveCorner", { x: 0, y: 0 }),
  withState("cornerOffset", "updateOffset", { x: 0, y: 0 }),
  withHandlers({
    updateStartingCoord: ({ startingPoint, updateStartingPoint }) => (x, y) => {
      updateStartingPoint({ x, y })
    },
    finishDrag: ({
      startingPoint,
      cornerCoordinates,
      moveCorner,
      updateOffset
    }) => ({ pageX: endX, pageY: endY }) => {
      const delta = {
        x: startingPoint.x - endX,
        y: startingPoint.y - endY
      }
      moveCorner({ x: endX, y: endY })
      updateOffset(delta)
    }
  })
)

export default enhancer(Corner)

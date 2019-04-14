import React, { useContext } from "react"
import { head, last } from "ramda"
import { compose, withHandlers, withState } from "recompose"
import { TransformContext } from "../CanvasTransform"
import Corner, { CORNER_CONTROL_SIZE } from "../Corner/Corner"

import BEM from "../../utils/BEM"
import "./Selection.scss"
import { getTransformSelection, transformPoint } from "../../utils/matrix"

const b = BEM("Selection")

const Selection = ({
  boundingRect,
  selectionBottomRight,
  setSelectionBottomRight,
  cornerDrag,
  endCornerDrag,
  selectionTransform,
  setSelectionTransform,
  startDrag
}) => {
  const transformation = useContext(TransformContext)
  const [minY, maxX, maxY, minX] = boundingRect
  const transfDrag = transformPoint(selectionTransform)

  const selectionPoints = [{ x: minX, y: minY }, { x: maxX, y: maxY }]
    .map(transformation)
    .map(transfDrag) // where selection corner drag happens

  const minPoint = head(selectionPoints)
  const maxPoint = last(selectionPoints)

  return (
    <g className={b()}>
      <line
        className={b("edge")}
        x1={minPoint.x}
        y1={minPoint.y}
        x2={maxPoint.x}
        y2={minPoint.y}
      />
      <line
        className={b("edge")}
        x1={maxPoint.x}
        y1={minPoint.y}
        x2={maxPoint.x}
        y2={maxPoint.y}
      />
      <line
        className={b("edge")}
        x1={minPoint.x}
        y1={maxPoint.y}
        x2={maxPoint.x}
        y2={maxPoint.y}
      />
      <line
        className={b("edge")}
        x1={minPoint.x}
        y1={minPoint.y}
        x2={minPoint.x}
        y2={maxPoint.y}
      />
      <Corner
        x={minPoint.x - CORNER_CONTROL_SIZE}
        y={minPoint.y - CORNER_CONTROL_SIZE}
      />
      <Corner
        x={maxPoint.x - CORNER_CONTROL_SIZE}
        y={minPoint.y - CORNER_CONTROL_SIZE}
      />
      <Corner
        onMouseDown={e => startDrag(e)}
        onMouseMove={e => cornerDrag(e)}
        onMouseUp={e => endCornerDrag(e)}

        x={maxPoint.x - CORNER_CONTROL_SIZE}
        y={maxPoint.y - CORNER_CONTROL_SIZE}
      />
      <Corner
        x={minPoint.x - CORNER_CONTROL_SIZE}
        y={maxPoint.y - CORNER_CONTROL_SIZE}
      />
    </g>
  )
}

const enhancer = compose(
  withState("selectionBottomRight", "setSelectionBottomRight", { x: 0, y: 0 }),
  withState(
    "selectionTransform",
    "setSelectionTransform",
    getTransformSelection(1, 1, 1, 1)
  ),
  withState("isDragging", "toggleDragging", false),
  withHandlers({
    // on mouse move:

    startDrag: ({ setSelectionBottomRight, toggleDragging, isDragging }) => ({
      pageX: x,
      pageY: y
    }) => {
      // set first point
      setSelectionBottomRight({ x, y })

      toggleDragging(true)
      console.log(isDragging, "is DRAG")
    },
    cornerDrag: ({
      selectionBottomRight,
      setSelectionBottomRight,
      setSelectionTransform,
      isDragging
    }) => ({ pageX: x, pageY: y }) => {
      const oldCoord = selectionBottomRight

      if (isDragging) {
        const dX = x - selectionBottomRight.x
        const dY = y - selectionBottomRight.y
        const zX = selectionBottomRight.x + dX
        const zY = selectionBottomRight.y + dY

        setSelectionTransform(
          getTransformSelection(
            zX / selectionBottomRight.x,
            zY / selectionBottomRight.y,
            1,
            1
          )
        )
      }
    },
    endCornerDrag: ({ setSelectionBottomRight, toggleDragging }) => ({
      pageX: x,
      pageY: y
    }) => {
      setSelectionBottomRight({ x, y })
      toggleDragging(false)
    }
  })
)

export default enhancer(Selection)

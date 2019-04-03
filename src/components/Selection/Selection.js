import React, { useContext } from "react"
import { head, last } from "ramda"
import { compose, withHandlers } from "recompose"
import { TransformContext } from "../CanvasTransform"
import Corner, { CORNER_CONTROL_SIZE } from "../Corner/Corner"

import BEM from "../../utils/BEM"
import "./Selection.scss"

const b = BEM("Selection")

const Selection = ({ boundingRect, startDrag, dragging, endDrag }) => {
  const transformation = useContext(TransformContext)

  const [minY, maxX, maxY, minX] = boundingRect
  const selectionPoints = [{ x: minX, y: minY }, { x: maxX, y: maxY }].map(
    transformation
  )
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
        onMouseDown={(e) => {startDrag(e)}}
        x={maxPoint.x - CORNER_CONTROL_SIZE}
        y={minPoint.y - CORNER_CONTROL_SIZE}
      />
      <Corner
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
  withHandlers({
    startDrag: () => ({pageX, pageY}) => console.log(pageY),
    dragging: () => () => {},
    endDrag: () => {}
  })
)

export default enhancer(Selection)

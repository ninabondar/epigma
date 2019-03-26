import React, { useContext } from "react"
import { head, last } from "ramda"
import { TransformContext } from "../CanvasTransform"

import BEM from "../../utils/BEM"
import "./Selection.scss"
const b = BEM("Selection")

const CONNER_CONTROL_SIZE = 10

const Corner = props => (
  <rect
    style={{
      transform: `translate(
        ${CONNER_CONTROL_SIZE / 2}px,
        ${CONNER_CONTROL_SIZE / 2}px
      )`
    }}
    className={b("vertex")}
    width={CONNER_CONTROL_SIZE}
    height={CONNER_CONTROL_SIZE}
    {...props}
  />
)

const Selection = ({ boundingRect }) => {
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
        x={minPoint.x - CONNER_CONTROL_SIZE}
        y={minPoint.y - CONNER_CONTROL_SIZE}
      />
      <Corner
        x={maxPoint.x - CONNER_CONTROL_SIZE}
        y={minPoint.y - CONNER_CONTROL_SIZE}
      />
      <Corner
        x={maxPoint.x - CONNER_CONTROL_SIZE}
        y={maxPoint.y - CONNER_CONTROL_SIZE}
      />
      <Corner
        x={minPoint.x - CONNER_CONTROL_SIZE}
        y={maxPoint.y - CONNER_CONTROL_SIZE}
      />
    </g>
  )
}

export default Selection

import React from "react"

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

const Selection = ({ boundingRect: [minY, maxX, maxY, minX] }) => (
  <g className={b()}>
    <line className={b("edge")} x1={minX} y1={minY} x2={maxX} y2={minY} />
    <line className={b("edge")} x1={maxX} y1={minY} x2={maxX} y2={maxY} />
    <line className={b("edge")} x1={minX} y1={maxY} x2={maxX} y2={maxY} />
    <line className={b("edge")} x1={minX} y1={minY} x2={minX} y2={maxY} />
    <Corner x={minX - CONNER_CONTROL_SIZE} y={minY - CONNER_CONTROL_SIZE} />
    <Corner x={maxX - CONNER_CONTROL_SIZE} y={minY - CONNER_CONTROL_SIZE} />
    <Corner x={maxX - CONNER_CONTROL_SIZE} y={maxY - CONNER_CONTROL_SIZE} />
    <Corner x={minX - CONNER_CONTROL_SIZE} y={maxY - CONNER_CONTROL_SIZE} />
  </g>
)

export default Selection

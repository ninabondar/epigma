import React from "react"
import BEM from "../../utils/BEM"

export const CORNER_CONTROL_SIZE = 10
const b = BEM("Selection")

const Corner = props => (
  <rect
    style={{
      transform: `translate(
        ${CORNER_CONTROL_SIZE / 2}px,
        ${CORNER_CONTROL_SIZE / 2}px
      )`
    }}
    className={b("vertex")}
    width={CORNER_CONTROL_SIZE}
    height={CORNER_CONTROL_SIZE}
    {...props}
  />
)

export default Corner

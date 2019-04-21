import React, { createContext } from "react"

import { compose, withHandlers, withState } from "recompose"
import Corner, { CORNER_CONTROL_SIZE } from "../Corner/Corner"

import {
  getTransformMatrixWithAsymmetricZoom,
  transformPoint
} from "../../utils/matrix"
import { getZoomMatrixXY } from "../../utils/helper"
import { changeActiveShape } from "../../actions"
import { connect } from "react-redux"
import { getActiveShapes } from "../../reducers"

import BEM from "../../utils/BEM"
import "./Selection.scss"

const b = BEM("Selection")

export const SelectionTransformContext = createContext()

const Selection = ({
  currentDocShapes,
  boundingRect,
  selectionTransform,
  setSelectionTransform,
  startDrag,
  children
}) => {
  const transfDrag = transformPoint(selectionTransform)

  const [minPoint, maxPoint] = boundingRect.map(transfDrag)

  return (
    <g className={b()}>
      <SelectionTransformContext.Provider value={transfDrag}>
        {children}
      </SelectionTransformContext.Provider>

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
  connect(state => {
    currentDocShapes: getActiveShapes(state)
  }),
  withState(
    "selectionTransform",
    "setSelectionTransform",
    getTransformMatrixWithAsymmetricZoom(1, 1, 1, 1)
  ),

  withHandlers({
    // on mouse move:
    startDrag: ({ setSelectionTransform, boundingRect }) => ev => {
      ev.stopPropagation()

      const [minPoint] = boundingRect

      const { pageX: startX, pageY: startY } = ev

      const cornerDrag = ({ pageX: x, pageY: y }) => {
        const dX = x - startX
        const dY = y - startY
        const zX = startX + dX
        const zY = startY + dY

        setSelectionTransform(
          getZoomMatrixXY(minPoint, zX / startX, zY / startY)
        )
      }

      const endDrag = () => {
        document.removeEventListener("mousemove", cornerDrag)
        document.removeEventListener("mouseup", endDrag)
      }

      document.addEventListener("mousemove", cornerDrag)
      document.addEventListener("mouseup", endDrag)
    },
    putNewShapeScaleToState: ({ currentDocShapes }) => e => {
      e.preventDefault()
      console.log(typeof currentDocShapes, "curr shapes")
    }
  })
)

export default enhancer(Selection)

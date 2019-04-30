import React, { createContext, useContext } from "react"

import { clone } from "ramda"
import { compose, withHandlers, withState } from "recompose"
import Corner, { CORNER_CONTROL_SIZE } from "../Corner/Corner"
import { TransformContext } from "../CanvasTransform"

import {
  getTransformMatrixWithAsymmetricZoom,
  transformPoint
} from "../../utils/matrix"
import { getZoomMatrixXY } from "../../utils/helper"

import { connect } from "react-redux"
import { getActiveDocument, getSelectedShapes } from "../../reducers"
import { changeEditorDocument } from "../../actions"

import BEM from "../../utils/BEM"
import "./Selection.scss"

const b = BEM("Selection")

export const SelectionTransformContext = createContext()

const Selection = ({
  boundingRect,
  selectionTransform,
  startDrag,
  children,
  canvasTransform
}) => {
  const selectionScale = transformPoint(selectionTransform)
  const [minPoint, maxPoint] = boundingRect
    .map(selectionScale)
    .map(canvasTransform)

  return (
    <g className={b()}>
      <SelectionTransformContext.Provider value={selectionScale}>
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
  connect(
    state => ({
      document: getActiveDocument(state),
      selectedShapes: getSelectedShapes(state)
    }),

    { changeEditorDocument }
  ),
  withState(
    "selectionTransform",
    "setSelectionTransform",
    getTransformMatrixWithAsymmetricZoom(1, 1, 0, 0)
  ),

  withHandlers({
    onTransform: ({
      changeEditorDocument,
      document,
      selectedShapes,
      selectionTransform
    }) => () => {
      const newDocument = clone(document)

      selectedShapes.map(selectedShapeId => {
        const shape = newDocument.shapes.find(
          ({ id }) => selectedShapeId === id
        )
        shape.points = shape.points.map(transformPoint(selectionTransform))
      })

      changeEditorDocument(newDocument)
    }
  }),

  withHandlers({
    // on mouse move:
    startDrag: ({ setSelectionTransform, boundingRect, onTransform }) => ev => {
      ev.stopPropagation()

      const [minPoint, maxPoint] = boundingRect

      const { pageX: startX, pageY: startY } = ev

      const cornerDrag = ({ pageX: x, pageY: y }) => {
        const selectionWidth = maxPoint.x - minPoint.x
        const selectionHeight = maxPoint.y - minPoint.y

        const dX = x - startX
        const dY = y - startY
        const zX = selectionWidth + dX
        const zY = selectionHeight + dY

        setSelectionTransform(
          getZoomMatrixXY(minPoint, zX / selectionWidth, zY / selectionHeight)
        )
      }

      const endDrag = () => {
        document.removeEventListener("mousemove", cornerDrag)
        document.removeEventListener("mouseup", endDrag)
        onTransform()
      }

      document.addEventListener("mousemove", cornerDrag)
      document.addEventListener("mouseup", endDrag)
    }
  })
)

const EnhancedSelection = enhancer(Selection)

export default props => (
  <TransformContext.Consumer>
    {transform => <EnhancedSelection {...props} canvasTransform={transform} />}
  </TransformContext.Consumer>
)

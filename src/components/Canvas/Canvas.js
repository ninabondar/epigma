// @flow
import React, { useContext } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router"
import {
  branch,
  compose,
  renderComponent,
  renderNothing,
  withHandlers,
  withProps,
  withState
} from "recompose"
import uuid from "uuid"

import Selection from "../Selection/Selection"
import {
  createPoint,
  createShape,
  getBoundingBoxFromShape
} from "../../utils/helper"

import {
  changeActiveShape,
  changeMode,
  openDocumentInEditor,
  setSelectedShapes
} from "../../actions"

import {
  getActiveDocument,
  getCurrentHistoryPointer,
  getDocumentById,
  getSelectedShapes
} from "../../reducers"

import Shape from "../Shape"
import CanvasTransform, { TransformContext } from "../CanvasTransform"

import BEM from "../../utils/BEM"
import "./Canvas.scss"
import { getActiveDocumentId } from "../../reducers"
const b = BEM("Canvas")

const getId = uuid

let SelectedShapes = ({
  shapes,
  setSelectedIndex,
  setShapes,
  offset,
  selectedIndex,
  selectionId
}) => {
  const transformation = useContext(TransformContext)

  const boundingBox = getBoundingBoxFromShape(shapes[0]) //TODO: fix it. Get boundingBox for all shapes. Not only for first

  const [minY, maxX, maxY, minX] = boundingBox
  const boundingRect = [createPoint(minX, minY), createPoint(maxX, maxY)].map(
    transformation
  )

  return (
    <Selection key={selectionId} boundingRect={boundingRect}>
      {shapes.map((shape, index) => (
        <Shape
          key={index}
          mode={"VIEW"}
          onSelect={() =>
            console.log("TODO: implement on select for selected shapes.")
          }
          onChange={path => {
            const id = path.id || getId()

            setSelectedIndex(null)

            setShapes([
              ...shapes.slice(0, selectedIndex),
              { id, ...path },
              ...shapes.slice(selectedIndex + 1)
            ])
          }}
          offset={offset}
          path={shape}
        />
      ))}
    </Selection>
  )
}

SelectedShapes = compose(
  connect(state => ({ selectionId: getCurrentHistoryPointer(state) })),
  branch(({ shapes }) => shapes.length === 0, renderNothing)
)(SelectedShapes)

const Canvas = ({
  shapes,
  offset,
  selectedShapes: selectedShapesId,
  selectedIndex,
  setSelectedIndex,
  setShapes,
  changeMode,
  mode,
  selectShape
}) => {
  const viewShapes = shapes.filter(({ id }) => !selectedShapesId.includes(id))
  const selectedShapes = shapes.filter(({ id }) =>
    selectedShapesId.includes(id)
  )

  return (
    <CanvasTransform>
      <svg className={b()}>
        {viewShapes.map((shape, index) => (
          <Shape
            key={index}
            mode={index === selectedIndex ? mode : "VIEW"}
            onSelect={e => {
              setSelectedIndex(index)
              selectShape(e, shape.id)
            }}
            onChange={path => {
              const id = path.id || getId()

              setSelectedIndex(null)

              setShapes([
                ...shapes.slice(0, selectedIndex),
                { id, ...path },
                ...shapes.slice(selectedIndex + 1)
              ])
            }}
            offset={offset}
            path={shape}
          />
        ))}

        <SelectedShapes
          offset={offset}
          shapes={selectedShapes}
          setSelectedIndex={setSelectedIndex}
          setShapes={setShapes}
          selectedIndex={selectedIndex}
        />

        {mode === "CREATE" ? (
          <Shape
            mode="CREATE"
            onChange={newShape => {
              changeMode("VIEW")

              if (newShape.points && newShape.points.length > 1) {
                setShapes([...shapes, newShape])
              }
            }}
          />
        ) : null}
        {shapes.length < 0 && <text dy={20}>Click to start drawing.</text>}
      </svg>
    </CanvasTransform>
  )
}

const enhancer = compose(
  withRouter,
  withProps(({ match }) => ({ documentId: match.params.documentId })),

  connect(
    (state, { documentId }) => ({
      editedDocumentId: getActiveDocumentId(state),
      document: getDocumentById(documentId, state)
    }),
    { openDocument: openDocumentInEditor }
  ),

  withProps(({ documentId, editedDocumentId, openDocument, document }) => {
    if (documentId !== editedDocumentId) {
      openDocument(document)
    }
  }),
  branch(
    ({ editedDocumentId }) => editedDocumentId === null,
    renderComponent(() => "Loading...")
  ),

  connect(
    (state, { documentId }) => {
      const selectedShapes = getSelectedShapes(state)
      const editedShape = null
      return {
        shapes: getActiveDocument(state).shapes,
        //prettier-ignore
        mode:
          editedShape !== null ? "EDIT" :
          selectedShapes !== null || selectedShapes.length !== 0 ? "SELECT":
          "VIEW",
        selectedShapes
      }
    },
    {
      setShapes: changeActiveShape,
      changeMode,
      setSelectedShapes
    }
  ),

  withState("offset", "setOffset", { x: 0, y: 0 }),
  withState("selectedIndex", "setSelectedIndex", null),

  withHandlers({
    addPath: ({
      shapes,
      offset,
      setSelectedIndex,
      setShapes,
      selectedIndex
    }) => ({ pageX: x, pageY: y }) => {
      if (selectedIndex !== null) return

      const point = createPoint({ x: x - offset.x, y: y - offset.y })

      setSelectedIndex(shapes.length)
      setShapes([...shapes, createShape(point)])
    },
    selectShape: ({ selectedShapes, setSelectedShapes }) => (e, id) =>
      setSelectedShapes([id])
  })
)

export default enhancer(Canvas)

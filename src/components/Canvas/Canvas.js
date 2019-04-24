// @flow

//TODO: do not use "document" as variable name. It makes code hard to read and debug

import React, { useContext, useEffect } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router"
import produce from "immer"
import uuidv1 from "uuid/v1"

import {
  branch,
  compose,
  renderComponent,
  renderNothing,
  withHandlers,
  withProps,
  withState
} from "recompose"

import Selection from "../Selection/Selection"
import { createPoint, getBoundingBoxFromShape } from "../../utils/helper"

import {
  changeEditorDocument,
  changeMode,
  openDocumentInEditor,
  setEditedShape,
  setSelectedShapes
} from "../../actions"

import {
  getActiveDocument,
  getCurrentHistoryPointer,
  getDocumentById,
  getEditedShape,
  getEditorMode,
  getSelectedShapes
} from "../../reducers"

import ShapeCreate from "../Shape/ShapeCreate"
import ShapeEdit from "../Shape/ShapeEdit"
import ShapeView from "../Shape/ShapeView"

import CanvasTransform, { TransformContext } from "../CanvasTransform"

import BEM from "../../utils/BEM"
import "./Canvas.scss"
import { getActiveDocumentId } from "../../reducers"

const b = BEM("Canvas")

let SelectedShapes = ({ shapes, offset, selectionId, setEditedShape }) => {
  const transformation = useContext(TransformContext)

  const boundingBox = getBoundingBoxFromShape(shapes[0]) //TODO: fix it. Get boundingBox for all shapes. Not only for first

  const [minY, maxX, maxY, minX] = boundingBox
  const boundingRect = [createPoint(minX, minY), createPoint(maxX, maxY)].map(
    transformation
  )

  useEffect(() => {
    const keyHandler = ev => {
      if (ev.key === "escape") {
        setSelectedShapes([])
      }
      // TODO handle more use cases of Escape
    }
    document.addEventListener("keypress", keyHandler)

    return () => document.removeEventListener("keypress", keyHandler)
  })

  return (
    <Selection key={selectionId} boundingRect={boundingRect}>
      {shapes.map(shape => (
        <ShapeView
          key={shape.id}
          onSelect={() => setEditedShape(shape.id)}
          offset={offset}
          path={shape}
        />
      ))}
    </Selection>
  )
}

SelectedShapes = compose(
  connect(
    state => ({ selectionId: getCurrentHistoryPointer(state) }),
    { setEditedShape }
  ),
  branch(({ shapes }) => shapes.length === 0, renderNothing)
)(SelectedShapes)

const Canvas = ({
  shapes,
  offset,
  selectedShapes: selectedShapesId,
  editedShape: editedShapeId,
  selectShape,
  setEditedShape,
  setShapes,
  isCreateMode,
  changeMode
}) => {
  const viewShapes = shapes
    .filter(({ id }) => !selectedShapesId.includes(id))
    .filter(({ id }) => editedShapeId !== id)

  const selectedShapes = shapes
    .filter(({ id }) => selectedShapesId.includes(id))
    .filter(({ id }) => editedShapeId !== id)

  const editedShape = shapes.find(({ id }) => editedShapeId === id)

  return (
    <CanvasTransform>
      <svg className={b()}>
        {viewShapes.map(shape => (
          <ShapeView
            key={shape.id}
            onSelect={() => selectShape(shape.id)}
            offset={offset}
            path={shape}
          />
        ))}

        {editedShape && (
          <ShapeEdit
            key={editedShape.id}
            offset={offset}
            path={editedShape}
            onChange={editedShape => {
              const newShapes = produce(shapes, draft => {
                const index = draft.findIndex(({ id }) => editedShape.id === id)
                draft[index] = editedShape
              })
              setShapes(newShapes)
              setEditedShape(null)
            }}
          />
        )}

        {editedShape ? (
          selectedShapes.map(shape => (
            <ShapeView
              key={shape.id}
              onSelect={() => selectShape(shape.id)}
              offset={offset}
              path={shape}
            />
          ))
        ) : (
          <SelectedShapes offset={offset} shapes={selectedShapes} />
        )}

        {isCreateMode && (
          <ShapeCreate
            offset={offset}
            onChange={newShape => {
              if (newShape.points && newShape.points.length > 1) {
                const id = uuidv1()
                newShape.id = id //TODO: fix it!
                setShapes([...shapes, newShape])
                selectShape(id)
              }

              changeMode("VIEW")
            }}
          />
        )}
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
      document: getDocumentById(documentId, state),
      isCreateMode: getEditorMode(state) === "CREATE"
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
    state => ({
      document: getActiveDocument(state),
      shapes: getActiveDocument(state).shapes,
      selectedShapes: getSelectedShapes(state),
      editedShape: getEditedShape(state)
    }),
    {
      changeMode,
      setSelectedShapes,
      setEditedShape,
      changeEditorDocument
    }
  ),

  withState("offset", "setOffset", { x: 0, y: 0 }),

  withHandlers({
    setShapes: ({ changeEditorDocument, document }) => shapes => {
      const newDocument = produce(document, draft => {
        draft.shapes = shapes
      })

      changeEditorDocument(newDocument)
    },

    selectShape: ({ setSelectedShapes }) => id => setSelectedShapes([id])
  })
)

export default enhancer(Canvas)

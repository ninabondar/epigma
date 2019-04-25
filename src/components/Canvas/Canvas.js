// @flow
import React, { useContext, useEffect, useState } from "react"
import { connect, useSelector, useActions } from "react-redux"
import { withRouter } from "react-router"

import produce from "immer"
import uuidv1 from "uuid/v1"
import { find, propEq, filter, contains, without } from "ramda"

import {
  branch,
  compose,
  renderComponent,
  withHandlers,
  withProps
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

import * as actions from "../../actions"

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

let SelectedShapes = ({ shapes, offset }) => {
  if (shapes.length === 0) return null

  const selectionId = useSelector(getCurrentHistoryPointer)
  const { setEditedShape } = useActions({
    setEditedShape: actions.setEditedShape
  })

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

const Canvas = ({
  allShapes,
  shapes,
  selectedShapes,
  editedShape,
  selectShape,

  isCreateMode,
  changeMode,
  setShapes,
  setEditedShape
}) => {
  const [offset] = useState({ x: 0, y: 0 })

  return (
    <CanvasTransform>
      <svg className={b()}>
        {shapes.map(shape => (
          <ShapeView
            key={shape.id}
            onSelect={() => selectShape(shape.id)}
            offset={offset}
            path={shape}
          />
        ))}

        <SelectedShapes offset={offset} shapes={selectedShapes} />

        {editedShape && (
          <ShapeEdit
            key={editedShape.id}
            offset={offset}
            path={editedShape}
            onChange={editedShape => {
              setShapes(
                produce(allShapes, draft => {
                  const index = draft.findIndex(
                    ({ id }) => editedShape.id === id
                  )
                  draft[index] = editedShape
                })
              )
              setEditedShape(null)
            }}
          />
        )}

        {isCreateMode && (
          <ShapeCreate
            offset={offset}
            onChange={newShape => {
              if (newShape.points && newShape.points.length > 1) {
                const id = uuidv1()
                newShape.id = id //TODO: fix it!
                setShapes([...allShapes, newShape])
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
      doc: getDocumentById(documentId, state)
    }),
    {
      openDocument: openDocumentInEditor,
      changeMode,
      setSelectedShapes,
      setEditedShape,
      changeEditorDocument
    }
  ),

  withProps(({ documentId, editedDocumentId, openDocument, doc }) => {
    if (documentId !== editedDocumentId) openDocument(doc)
  }),

  branch(
    ({ editedDocumentId }) => editedDocumentId === null,
    renderComponent(() => "Loading...")
  ),

  connect(state => {
    const doc = getActiveDocument(state)
    const isCreateMode = getEditorMode(state) === "CREATE"
    const editedShape = find(propEq("id", getEditedShape(state)), doc.shapes)
    const selectedShapes = editedShape
      ? []
      : filter(({ id }) => contains(id, getSelectedShapes(state)), doc.shapes)

    return {
      isCreateMode,
      allShapes: doc.shapes,
      shapes: without([...selectedShapes, editedShape], doc.shapes),
      selectedShapes,
      editedShape
    }
  }),

  withHandlers({
    setShapes: ({ changeEditorDocument, doc }) => shapes =>
      changeEditorDocument(
        produce(doc, draft => {
          draft.shapes = shapes
        })
      ),
    selectShape: ({ setSelectedShapes }) => id => setSelectedShapes([id])
  })
)

export default enhancer(Canvas)

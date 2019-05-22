import React from "react"
import ToolPanel from "../ToolPanel/ToolPanel"
import Canvas from "../Canvas"
import ShapeEditPanel from "../ShapeEditPanel/ShapeEditPanel"

import produce from "immer"
import { find, propEq, filter, contains, without } from "ramda"

import { withRouter } from "react-router-dom"
import { useActions, useSelector } from "react-redux"
import {
  getActiveDocument,
  getActiveDocumentId,
  getDocumentById,
  getEditedShape,
  getEditorMode,
  getSelectedShapes
} from "../../reducers"
import * as actions from "../../actions"

const useCanvasData = doc => {
  const allShapes = doc.shapes

  const isCreateMode = useSelector(getEditorMode) === "CREATE"
  const editedShapeId = useSelector(getEditedShape)
  const selectedShapesId = useSelector(getSelectedShapes)

  const editedShape = find(propEq("id", editedShapeId), doc.shapes)
  const selectedShapes = editedShape
    ? []
    : filter(({ id }) => contains(id, selectedShapesId), doc.shapes)

  const {
    setSelectedShapes,
    setEditedShape,
    changeEditorDocument,
    changeMode
  } = useActions(actions)

  const viewedShapes = without([...selectedShapes, editedShape], doc.shapes)

  const setShapes = shapes =>
    changeEditorDocument(
      produce(doc, draft => {
        draft.shapes = shapes
      })
    )
  const selectShape = id => setSelectedShapes([id])

  return {
    isCreateMode,

    allShapes,
    viewedShapes,
    editedShape,
    selectedShapes,

    setEditedShape,
    setShapes,
    selectShape,
    changeMode
  }
}

const useEditorDocument = documentId => {
  const editedDocId = useSelector(getActiveDocumentId)
  const doc = useSelector(getDocumentById(documentId))
  const activeDoc = useSelector(getActiveDocument)

  const { openDocumentInEditor } = useActions(actions)

  if (documentId !== editedDocId) openDocumentInEditor(doc)

  return activeDoc
}

const CanvasWithDocument = ({ doc }) => <Canvas {...useCanvasData(doc)} />

const DocumentLoader = withRouter(({ match }) => {
  const { documentId } = match.params
  const doc = useEditorDocument(documentId)

  return doc === null ? "Loading..." : <CanvasWithDocument doc={doc} />
})

const Editor = () => (
  <>
    <ToolPanel />
    <DocumentLoader />
    <ShapeEditPanel />
  </>
)

export default Editor

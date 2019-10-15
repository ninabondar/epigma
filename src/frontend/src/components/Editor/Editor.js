import React from "react"

import produce from "immer"
import { find, propEq, filter, contains, without } from "ramda"

import { withRouter } from "react-router-dom"
import { useDispatch, useSelector, connect } from "react-redux"
import {
  compose,
  withProps,
} from "recompose"

import { getAllExistingDocuments, getIsFetching } from "../../reducers"
import { fetchDocuments } from "../../actions/documents"


//
import {
  getActiveDocument,
  getActiveDocumentId,
  getDocumentById,
  getEditedShape,
  getEditorMode,
  getIsFetchingDocById,
  getSelectedShapes
} from "../../reducers"
import {
  setSelectedShapes,
  setEditedShape,
  changeDocumentSuccess,
  changeMode,
  requestDocById,
  openDocumentInEditor
} from "../../actions"

//
import ToolPanel from "../ToolPanel/ToolPanel"
import Canvas from "../Canvas"
import ShapeEditPanel from "../ShapeEditPanel/ShapeEditPanel"

import "./Editor.scss"
import BEM from "../../utils/BEM"
const b = BEM("Editor")

const useCanvasData = doc => {
  const allShapes = doc.shapes

  const isCreateMode = useSelector(getEditorMode) === "CREATE"
  const editedShapeId = useSelector(getEditedShape)
  const selectedShapesId = useSelector(getSelectedShapes)

  const editedShape = find(propEq("id", editedShapeId), doc.shapes)
  const selectedShapes = editedShape
    ? []
    : filter(({ id }) => contains(id, selectedShapesId), doc.shapes)

  const viewedShapes = without([...selectedShapes, editedShape], doc.shapes)

  const setShapes = shapes =>
    changeDocumentSuccess(
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
  const isDocumentFetching = useSelector(getIsFetchingDocById(documentId))
  const dispatch = useDispatch()

  if (!doc && !isDocumentFetching) {
    dispatch(requestDocById(documentId))
  }

  const activeDoc = useSelector(getActiveDocument)

  if (doc && documentId !== editedDocId) {
    dispatch(openDocumentInEditor(doc))
  }

  return activeDoc
}

const CanvasWithDocument = ({ doc }) => <Canvas {...useCanvasData(doc)} />

const DocumentLoader = withRouter(({ match }) => {
  const { documentId } = match.params
  const doc = useEditorDocument(documentId)

  return doc === null ? "Opening document..." : <CanvasWithDocument doc={doc} />
})

const Editor = () => {
  const selectedShapes = useSelector(getSelectedShapes)

  return (
    <div className={b()}>
      <div className={b("top-panel")}>
        <ToolPanel />
      </div>
      <div className={b("canvas")}>
        <DocumentLoader />
      </div>

      <section className={b("side-panel")}>
        {selectedShapes.length === 0 && "This is Epigma! The best svg editor ever."}
        {selectedShapes.length !== 0 && <ShapeEditPanel shapes={selectedShapes} />}
      </section>
    </div>
  )
}

const enhancer = compose(
  connect(
    state => ({
      documentsList: getAllExistingDocuments(state),
      isFetching: getIsFetching(state)
    }),
    { fetchDocuments }
  ),
  withProps(({ documentsList, isFetching ,fetchDocuments }) => {
    if (!isFetching && !documentsList.length <= 1) {
      fetchDocuments()
    }
  })
)

export default enhancer(Editor)


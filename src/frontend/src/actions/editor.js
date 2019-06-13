// @flow

import {
  CHANGE_EDITOR_DOCUMENT_SUCCESS,
  CHANGE_MODE,
  OPEN_DOCUMENT,
  REDO,
  SET_EDITED_SHAPE,
  SET_SELECTED_SHAPES,
  SHAPE_EDIT_PANEL_IN_FOCUS,
  UNDO
} from "./actionTypes"
import { apiURL } from "./documents"

export const changeMode = (mode: "VIEW" | "EDIT" | "CREATE") => ({
  type: CHANGE_MODE,
  mode
})

export const setEditedShape = shapeId => ({
  type: SET_EDITED_SHAPE,
  payload: { shapeId }
})

export const setSelectedShapes = selectedShapes => ({
  type: SET_SELECTED_SHAPES,
  selectedShapes
})

export const openDocumentInEditor = document => ({
  type: OPEN_DOCUMENT,
  payload: { document }
})

export const changeEditorDocumentSuccess = document => ({
  type: CHANGE_EDITOR_DOCUMENT_SUCCESS,
  document
})

export const editorUndo = () => ({
  type: UNDO
})

export const editorRedo = () => ({
  type: REDO
})

export const setShapePanelInFocus = focus => ({
  type: SHAPE_EDIT_PANEL_IN_FOCUS,
  focus
})

export const updateEditorDocument = doc => dispatch => {
  const { id } = doc
  return fetch(apiURL + "/" + id, {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(doc)
  })
    .then(res => {
      dispatch(changeEditorDocumentSuccess(doc))
    })
    .catch(err => {
      console.log(`Something went wrong while updating the doc`)
      throw err
    })
}

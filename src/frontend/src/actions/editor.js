// @flow
import {
  CHANGE_DOCUMENT_SUCCESS,
  CHANGE_MODE,
  OPEN_DOCUMENT,
  SET_EDITED_SHAPE,
  SET_SELECTED_SHAPES,
  REDO,
  UNDO
} from "./actionTypes"

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

export const editorUndo = () => ({ type: UNDO })
export const editorRedo = () => ({ type: REDO })

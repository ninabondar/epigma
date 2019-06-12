// @flow
import {
  CHANGE_MODE,
  SET_SELECTED_SHAPES,
  CHANGE_ACTIVE_DOC_ID,
  OPEN_DOCUMENT,
  CHANGE_EDITOR_DOCUMENT_SUCCESS,
  UNDO,
  REDO,
  SET_EDITED_SHAPE
} from "../actions/actionTypes"

import produce from "immer"

const defaultState = {
  mode: "VIEW", //"CREATE",
  isTransformingShapes: false,
  pickedShape: null,
  history: [],
  historyPointer: null
}

export default produce((draft, action) => {
  switch (action.type) {
    case OPEN_DOCUMENT: {
      draft.historyPointer = 0
      draft.history = [
        {
          document: action.payload.document,
          selectedShapes: [],
          pickedShape: null
        }
      ]
      return
    }

    case CHANGE_MODE: {
      draft.mode = action.mode
      return
    }

    case SET_EDITED_SHAPE: {
      const { shapeId } = action.payload
      draft.pickedShape = shapeId
      return
    }

    case SET_SELECTED_SHAPES: {
      const { selectedShapes } = action
      const { historyPointer } = draft

      draft.historyPointer++
      draft.history = [
        ...draft.history.slice(0, historyPointer + 1),
        {
          ...draft.history[historyPointer],
          selectedShapes: selectedShapes
        }
      ]
      return
    }

    case CHANGE_ACTIVE_DOC_ID: {
      draft.activeDocumentID = action.activeDocumentID
      return
    }

    case CHANGE_EDITOR_DOCUMENT_SUCCESS: {
      const { document } = action
      const { history, historyPointer } = draft
      draft.historyPointer++
      draft.history = [
        ...draft.history.slice(0, historyPointer + 1),
        {
          ...history[historyPointer],
          document
        }
      ]
      return
    }

    case UNDO: {
      draft.historyPointer--
      return
    }

    case REDO: {
      draft.historyPointer++
      return
    }
    default: {
      return
    }
  }
}, defaultState)

// Selectors
export const getEditorMode = state => state.mode
export const getSelectedShapes = state => {
  const { historyPointer, history } = state
  const editorState = history[historyPointer]
  return editorState && editorState.selectedShapes
}

export const getEditedShape = state => state.pickedShape

export const getActiveDocument = state => {
  const { historyPointer } = state
  if (historyPointer === null) return null
  const currentEditorState = state.history[historyPointer]
  const { document } = currentEditorState
  return document
}

export const getActiveDocumentId = state => {
  const document = getActiveDocument(state)
  return document && document.id
}

export const getHistoryLength = state => state.history.length

export const getCurrentHistoryPointer = state => state.historyPointer

export const getOpenDocumentTitle = state => {
  const document = getActiveDocument(state)
  return document && document.title
}

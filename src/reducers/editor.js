// @flow
import {
  CHANGE_MODE,
  SET_SELECTED_SHAPES,
  CHANGE_ACTIVE_DOC_ID,
  CHANGE_ACTIVE_SHAPE,
  OPEN_DOCUMENT
} from "../actions/actionTypes"

const defaultState = {
  mode: "VIEW", //"CREATE",
  isTransformingShapes: false,
  pickedShape: null,
  history: [],
  historyPointer: null
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case OPEN_DOCUMENT:
      return {
        ...state,
        historyPointer: 0,
        history: [
          {
            document: action.payload.document,
            selectedShapes: [],
            pickedShape: null
          }
        ]
      }
    case CHANGE_MODE:
      return {
        ...state,
        mode: action.mode
      }
    case SET_SELECTED_SHAPES:
      const { selectedShapes } = action
      return {
        ...state,

        historyPointer: state.historyPointer + 1,
        history: [
          ...state.history,
          {
            ...state.history[state.historyPointer],
            selectedShapes: selectedShapes
          }
        ]
      }
    case CHANGE_ACTIVE_SHAPE:
      return action.shape
    case CHANGE_ACTIVE_DOC_ID:
      return {
        ...state,
        activeDocumentID: action.activeDocumentID
      }
    default:
      return state
  }
}

// Selectors
export const getEditorMode = state => state.mode
export const getSelectedShapes = state => {
  const { historyPointer, history } = state
  const editorState = history[historyPointer]
  return editorState && editorState.selectedShapes
}

export const getActiveShapes = state => state.pickedShape

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

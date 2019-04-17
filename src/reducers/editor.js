// @flow
import {
  CHANGE_MODE,
  SET_SELECTED_SHAPES,
  CHANGE_ACTIVE_DOC_ID
} from "../actions/actionTypes"

const defaultState = {
  mode: "VIEW", //"CREATE",
  isTransformingShapes: false,
  selectedShapes: [],
  activeDocumentID: 1
  // TODO: Use the next structure
  //
  // editorHistory: [
  //   {
  //     mode: "CREATE",
  //     selectedShapes; [],
  //     selectedVertex: null,
  //     document: null
  //   }
  // ],
  // currentHistoryPointer: 0,
}
export default (state = defaultState, action) => {
  switch (action.type) {
    case CHANGE_MODE:
      return {
        ...state,
        mode: action.mode
      }
    case SET_SELECTED_SHAPES:
      return {
        ...state,
        selectedShapes: action.selectedShapes
      }
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
export const getSelectedShapes = state => state.selectedShapes
export const getActiveDocumentID = state => state.activeDocumentID
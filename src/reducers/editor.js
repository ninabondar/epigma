// @flow
import { CHANGE_MODE, SET_SELECTED_SHAPES } from "../actions/actionTypes"

const defaultState = {
  mode: "VIEW", //"CREATE",
  isTransformingShapes: false,
  selectedShapes: []
  // TODO: Use the next structure
  // activeDocumentID: 1,
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
    default:
      return state
  }
}

// Selectors
export const getEditorMode = state => state.mode
export const getSelectedShapes = state => state.selectedShapes

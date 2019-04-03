// @flow
import { CHANGE_MODE } from "../actions/actionTypes"

const defaultState = {
  mode: "CREATE",

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
    default:
      return state
  }
}

// Selectors
export const getEditorMode = state => state.mode

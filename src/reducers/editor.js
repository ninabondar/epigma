// @flow
import {
  CHANGE_MODE,
  SET_SELECTED_SHAPES,
  CHANGE_ACTIVE_DOC_ID,
  CHANGE_ACTIVE_SHAPE
} from "../actions/actionTypes"
import { createPoint } from "../utils/helper"

const defaultState = {
  mode: "VIEW", //"CREATE",
  isTransformingShapes: false,
  selectedShapes: [],
  pickedShapes: [],
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

const defaultDocState = [
  {
    // this is a shape in a document
    id: 1,
    points: [
      createPoint(139, 157.3333282470703),
      createPoint(424, 294.3333282470703),
      createPoint(433, 80.33332824707031),
      createPoint(136, 251.3333282470703),
      createPoint(568, 174.3333282470703),
      createPoint(131, 155.3333282470703)
    ],
    style: null
  }
]

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
export const getSelectedShapes = state => state.selectedShapes
export const getActiveDocumentID = state => state.activeDocumentID
export const getActiveShapes = state => state.pickedShapes

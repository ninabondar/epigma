// @flow
import { CHANGE_MODE } from "../actions/actionTypes"

const defaultState = { mode: "CREATE" }

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

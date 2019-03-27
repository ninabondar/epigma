import undoable from "./historyEnhancer"
import { MOVE_VERTEX } from "../actions/actionTypes"

const vertex = undoable((state = {}, action) => {
  switch (action.type) {
    case MOVE_VERTEX:
      const { point } = action
      return {
        ...state,
        point
      }
    default:
      return state
  }
})

export default vertex

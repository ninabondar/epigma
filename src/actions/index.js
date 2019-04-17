import { UNDO } from "./actionTypes"

export const changeActiveShape = newShape => ({
  type: "CHANGE_ACTIVE_SHAPE",
  shape: newShape
})

export const undoShape = () => ({
  type: UNDO
})

export * from "./editor"

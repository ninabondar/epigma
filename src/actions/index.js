import { CHANGE_ACTIVE_SHAPE } from "./actionTypes"

export const changeActiveShape = newShape => ({
  type: CHANGE_ACTIVE_SHAPE,
  shape: newShape
})

export * from "./editor"

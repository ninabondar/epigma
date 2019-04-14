// @flow

import { CHANGE_MODE, SET_SELECTED_SHAPES } from "./actionTypes"

export const changeMode = (mode: "VIEW" | "EDIT" | "CREATE") => ({
  type: CHANGE_MODE,
  mode
})

export const setSelectedShapes = (selectedShapes) => ({
  type: SET_SELECTED_SHAPES,
  selectedShapes
})

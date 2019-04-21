// @flow

import { CHANGE_MODE, OPEN_DOCUMENT, SET_SELECTED_SHAPES } from "./actionTypes"

export const changeMode = (mode: "VIEW" | "EDIT" | "CREATE") => ({
  type: CHANGE_MODE,
  mode
})

export const setSelectedShapes = selectedShapes => ({
  type: SET_SELECTED_SHAPES,
  selectedShapes
})

export const openDocument = document => ({
  type: OPEN_DOCUMENT,
  payload: {document}
})

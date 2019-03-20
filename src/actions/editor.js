// @flow

import { CHANGE_MODE } from "./actionTypes"

export const changeMode = (mode: "VIEW" | "EDIT" | "CREATE") => ({
  type: CHANGE_MODE,
  mode
})

import { combineReducers } from "redux"
import shapes from "./shape"
import vertex from './vertex.js'
import editor, * as fromEditor from "./editor"

export default combineReducers({ shapes, editor, vertex})

export const getActiveShapes = state => state.shapes.present

// Editor selectors
export const getEditorMode = state => fromEditor.getEditorMode(state.editor)

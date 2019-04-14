import { combineReducers } from "redux"
import vertex from "./vertex.js"

import documents, * as fromDocuments from "./documents"
import editor, * as fromEditor from "./editor"

export default combineReducers({ documents, editor, vertex })

export const getActiveShapes = state =>
  fromDocuments.getActiveShapes(state.documents)

// Editor selectors
export const getEditorMode = state => fromEditor.getEditorMode(state.editor)

export const getSelectedShapes = state =>
  fromEditor.getSelectedShapes(state.editor)

import { combineReducers } from "redux"
import vertex from "./vertex.js"
import document, * as fromDocuments from './document';

import editor, * as fromEditor from "./editor"

export default combineReducers({ document, editor, vertex })

export const getActiveShapes = state =>
  fromEditor.getActiveShapes(state.editor)

// Editor selectors
export const getEditorMode = state => fromEditor.getEditorMode(state.editor)

export const getSelectedShapes = state =>
  fromEditor.getSelectedShapes(state.editor)

export const getActiveDocumentID = state =>
  fromEditor.getActiveDocumentID(state.editor)

export const getDocumentById = (id,state) =>
  fromDocuments.getDocumentById(id, state.document)
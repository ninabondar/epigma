import { combineReducers } from "redux"
import vertex from "./vertex.js"
import documents, * as fromDocuments from "./documents"
import editor, * as fromEditor from "./editor"

export default combineReducers({ documents, editor, vertex })

// Editor selectors
export const getEditedShape = state => fromEditor.getEditedShape(state.editor)

export const getActiveDocumentId = state =>
  fromEditor.getActiveDocumentId(state.editor)

export const getHistoryLength = state =>
  fromEditor.getHistoryLength(state.editor)

export const getActiveDocument = state =>
  fromEditor.getActiveDocument(state.editor)

export const getEditorMode = state => fromEditor.getEditorMode(state.editor)

export const getSelectedShapes = state =>
  fromEditor.getSelectedShapes(state.editor)

export const getCurrentHistoryPointer = state =>
  fromEditor.getCurrentHistoryPointer(state.editor)

// Document selectors
export const getAllExistingDocuments = state =>
  fromDocuments.getAllExistingDocuments(state.documents)

export const getDocumentById = (id, state) =>
  fromDocuments.getDocumentById(id, state.documents)

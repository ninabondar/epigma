import produce from "immer"
import {
  CREATE_DOCUMENT_SUCCESS,
  RECEIVE_DOCUMENTS_SUCCESS,
  REQUEST_DOCS,
  REMOVE_DOC_SUCCESS
} from "../actions/actionTypes"

const defaultState = {}

export default (state = defaultState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CREATE_DOCUMENT_SUCCESS:
        const newDocumentIndex = Object.keys(draft).length + 1
        return {
          ...draft,
          [String(newDocumentIndex)]: action.body
        }

      case RECEIVE_DOCUMENTS_SUCCESS:
        return {
          ...action.documents,
          isFetching: false
        }
      case REQUEST_DOCS:
        return {
          ...draft,
          isFetching: true
        }
      case REMOVE_DOC_SUCCESS:
        const newDocsList = delete draft[action.id]
        return {
          ...newDocsList
        }

      default:
        return draft
    }
  })

export const getAllExistingDocuments = state => Object.values(state)
export const getDocumentById = (id, state) => state[id]
export const getIsFetching = state => state.isFetching

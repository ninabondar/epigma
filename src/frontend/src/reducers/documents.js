import produce from "immer"

import {
  CREATE_DOCUMENT_SUCCESS,
  RECEIVE_DOCUMENTS_SUCCESS,
  REQUEST_DOCS,
  REMOVE_DOC_SUCCESS,
  //
  RECEIVE_DOCUMENTS_ERROR,
  //
  REQUEST_DOC_BY_ID_START,
  REQUEST_DOC_BY_ID_SUCCESS,
  REQUEST_DOC_BY_ID_ERROR
} from "../actions/actionTypes"

const defaultState = {
  fetchedDocuments: []
}

export default (state = defaultState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case REQUEST_DOC_BY_ID_START: {
        const { id } = action
        draft.fetchedDocuments.push(id)
        break
      }

      case REQUEST_DOC_BY_ID_SUCCESS: {
        const { doc, id } = action
        draft[id] = doc

        draft.fetchedDocuments = draft.fetchedDocuments.filter(
          fetchedId => fetchedId !== id
        )

        break
      }

      case CREATE_DOCUMENT_SUCCESS: {
        const { body } = action
        const { id } = body
        draft[id] = body
        break
      }

      case RECEIVE_DOCUMENTS_SUCCESS: {
        const { documents } = action
        documents.map(document => {
          const { id } = document
          draft[id] = document
          draft.fetchedDocuments = draft.fetchedDocuments.filter(
            fetchedId => fetchedId !== id
          )
        })

        draft.isFetching = false
        break
      }

      case REQUEST_DOCS: {
        draft.isFetching = true
        break
      }

      case REMOVE_DOC_SUCCESS: {
        const { id } = action
        delete draft[id]
        break
      }
      default: {
      }
    }
  })

export const getAllExistingDocuments = state =>
  Object.entries(state)
    .filter(([key]) => key !== "fetchedDocuments")
    .map(([key, value]) => value)

export const getDocumentById = (id, state) => state[id]

export const getIsFetching = state => state.isFetching

export const getIsFetchingDocById = (id, state) =>
  state.fetchedDocuments.includes(id)

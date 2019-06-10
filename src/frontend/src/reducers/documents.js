import produce from "immer"
import { without } from "ramda"
import {
  CREATE_DOCUMENT_SUCCESS,
  RECEIVE_DOCUMENTS_SUCCESS,
  REQUEST_DOCS,
  REMOVE_DOC_SUCCESS,
  RECEIVE_DOCUMENTS_ERROR
} from "../actions/actionTypes"

const defaultState = {}

export default (state = defaultState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CREATE_DOCUMENT_SUCCESS:
        const { body } = action
        body.id = body._id
        delete body._id

        const newDocumentIndex = Object.keys(draft).length + 1
        return {
          ...draft,
          [String(newDocumentIndex)]: action.body
        }

      case RECEIVE_DOCUMENTS_SUCCESS:
        const { documents } = action
        documents.map(el => {
          el.id = el._id
          delete el._id
        })
        return {
          ...documents,
          isFetching: false
        }

      case RECEIVE_DOCUMENTS_ERROR:
        return draft

      case REQUEST_DOCS:
        return {
          ...draft,
          isFetching: true
        }
      case REMOVE_DOC_SUCCESS:
        const { isFetching } = draft
        const toRemove = Object.values(draft).filter(
          doc => doc.id === action.id
        )
        return {
          ...without(toRemove, Object.values(draft)),
          isFetching
        }

      default:
        return draft
    }
  })

export const getAllExistingDocuments = state => Object.values(state)
export const getDocumentById = (id, state) =>
  Object.values(state).filter(doc => doc.id === id)
export const getIsFetching = state => state.isFetching

import {
  CREATE_DOCUMENT_SUCCESS,
  RECEIVE_DOCUMENTS_SUCCESS,
  REQUEST_DOCS,
  RECEIVE_DOCUMENTS_ERROR,
  REMOVE_DOC_SUCCESS,
  //
  REQUEST_DOC_BY_ID_START,
  REQUEST_DOC_BY_ID_SUCCESS,
  REQUEST_DOC_BY_ID_ERROR
} from "./actionTypes"

import api from "../api"

export const apiURL = process.env.REACT_APP_API_ENDPOINT + "/documents"

const requestDocDyIdStart = id => ({ type: REQUEST_DOC_BY_ID_START, id })
const requestDocDyIdSuccess = (id, doc) => ({
  type: REQUEST_DOC_BY_ID_SUCCESS,
  id,
  doc
})
const requestDocDyIdError = (id, error) => ({
  type: REQUEST_DOC_BY_ID_ERROR,
  id,
  error
})

export const requestDocById = id => async dispatch => {
  dispatch(requestDocDyIdStart(id))
  try {
    const doc = await api.fetchDocument(id)
    dispatch(requestDocDyIdSuccess(id, doc))
  } catch (error) {
    dispatch(requestDocDyIdError(id, error))
  }
}

export const createDocumentSuccess = body => ({
  type: CREATE_DOCUMENT_SUCCESS,
  body
})

const receiveDocumentsSuccess = documents => ({
  type: RECEIVE_DOCUMENTS_SUCCESS,
  documents
})

const receiveDocumentsError = () => ({
  type: RECEIVE_DOCUMENTS_ERROR
})

const requestDocs = () => ({
  type: REQUEST_DOCS
})

const removeDocumentSuccess = id => ({
  type: REMOVE_DOC_SUCCESS,
  id
})

export const createNewDocument = title => async dispatch => {
  const body = {
    title,
    author: "",
    contributors: [],
    shapes: []
  }

  try {
    const res = await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })

    if (!res.ok) throw new Error("Error with request") //TODO: write common error handler

    const doc = await res.json()
    dispatch(createDocumentSuccess(doc))
  } catch (err) {
    console.info("couldn't add document")
  }
}

export const fetchDocuments = () => async dispatch => {
  dispatch(requestDocs())

  try {
    const res = await fetch(apiURL)
    if (!res.ok) throw new Error("Request failed")

    const docs = await res.json()
    dispatch(receiveDocumentsSuccess(docs))
  } catch (e) {
    console.info("An error occurred while fetching documents: ")
    dispatch(receiveDocumentsError())
    throw e
  }
}

export const removeDocumentById = docId => dispatch => {
  return fetch(apiURL + "/" + docId, {
    method: "DELETE",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  })
    .then(res => {
      dispatch(removeDocumentSuccess(docId))
    })
    .catch(err => {
      console.info("An error occurred while deleting a document: ", err)
    })
}

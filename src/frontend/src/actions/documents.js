import uuid from "uuid/v4"
import {
CREATE_DOCUMENT_SUCCESS,
RECEIVE_DOCUMENTS_SUCCESS,
REQUEST_DOCS,
REMOVE_DOC_SUCCESS,
RECEIVE_DOCUMENTS_ERROR
} from "./actionTypes"

export const apiURL =  process.env.REACT_APP_API_ENDPOINT  + "/documents"

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

export const createNewDocument = title => dispatch => {
  const body = {
    _id: uuid(),
    title: title,
    author: "",
    contributors: [],
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toDateString(),
    shapes: []
  }

  fetch(apiURL, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(body)
  })
    .then(res => {
      if (res.ok) {
        dispatch(createDocumentSuccess(body))
      }
    })
    .catch(err => console.info("couldn't add document"))
}

export const fetchDocuments = () => dispatch => {
  dispatch(requestDocs())
  return fetch(apiURL, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  })
    .then(res => {
      if (res.ok) {
        return res.json()
      }
    })
    .then(docs => {
      dispatch(receiveDocumentsSuccess(docs))
    })
    .catch(err => {
      console.info("An error occurred while fetching documents: ")
      dispatch(receiveDocumentsError())
      throw err
    })
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


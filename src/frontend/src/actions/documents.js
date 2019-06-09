import {
  CREATE_DOCUMENT_SUCCESS,
  RECEIVE_DOCUMENTS_SUCCESS,
  REQUEST_DOCS,
  REMOVE_DOC_SUCCESS
} from "./actionTypes"

export const apiURL = "http://localhost:8000/api/documents"

export const createDocumentSuccess = body => ({
  type: CREATE_DOCUMENT_SUCCESS,
  body
})

const receiveDocumentsSuccess = documents => ({
  type: RECEIVE_DOCUMENTS_SUCCESS,
  documents
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
    id: "4",
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
      dispatch(removeDocumentSuccess())
    })
    .catch(err => {
      console.info("An error occurred while deleting a document: ", err)
    })
}

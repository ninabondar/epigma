import {
  CREATE_DOCUMENT_SUCCESS,
  END_RECEIVING_DOCUMENTS,
  RECEIVE_DOCUMENTS_SUCCESS
} from "./actionTypes"

export const createDocumentSuccess = body => ({
  type: CREATE_DOCUMENT_SUCCESS,
  body
})

const receiveDocumentsSuccess = documents => ({
  type: RECEIVE_DOCUMENTS_SUCCESS,
  documents
})

const endReceivingDocuments = () => ({
  type: END_RECEIVING_DOCUMENTS
})

export const apiURL = "http://localhost:8000/api/documents"

export const createNewDocument = title => dispatch => {
  const body = {
    id: "3",
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
    .catch(err => console.log("couldn't add document"))
}

export const fetchDocuments = () => dispatch => {
  fetch(apiURL, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  })
    .then(res => {
      if (res.ok) {
        //console.log("requested successfully")
        return res.json()
      }
    })
    .then(docs => {
      dispatch(receiveDocumentsSuccess(docs))
      dispatch(endReceivingDocuments())
    })
    .catch(err => {
      console.log("An error occurred while fetching documents: ")
      throw err
    })
}

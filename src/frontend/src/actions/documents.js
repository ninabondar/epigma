import {
  CREATE_DOCUMENT,
  END_RECEIVING_DOCUMENTS,
  RECEIVE_DOCUMENTS_SUCCESS
} from "./actionTypes"

export const createDocument = title => ({
  type: CREATE_DOCUMENT,
  title
})

const receiveDocumentsSuccess = documents => ({
  type: RECEIVE_DOCUMENTS_SUCCESS,
  documents
})

const endReceivingDocuments = () => ({
  type: END_RECEIVING_DOCUMENTS
})

export const apiURL = "http://localhost:8000/api/documents"

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
        return res.json()
      }
    })
    .then(docs => {
      dispatch(receiveDocumentsSuccess(docs))
    })
    .catch(err => {
      console.log("An error occurred while fetching documents: ")
      throw err
    })
}

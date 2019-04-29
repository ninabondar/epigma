import { CREATE_DOCUMENT, CHANGE_DOCUMENT_TITLE } from "./actionTypes"

export const createDocument = title => ({
  type: CREATE_DOCUMENT,
  title
})

export const changeDocumentTitle = (id, title) => ({
  type: CHANGE_DOCUMENT_TITLE,
  title,
  documentId: id
})

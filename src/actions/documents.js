import { CREATE_DOCUMENT } from "./actionTypes"

export const createDocument = title => ({
  type: CREATE_DOCUMENT,
  title
})

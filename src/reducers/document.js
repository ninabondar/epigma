import { createPoint } from "../utils/helper"

const defaultState = [
  {
    // this is a shape in a document
    id: 1,
    points: [
      createPoint(139, 157.3333282470703),
      createPoint(424, 294.3333282470703),
      createPoint(433, 80.33332824707031),
      createPoint(136, 251.3333282470703),
      createPoint(568, 174.3333282470703),
      createPoint(131, 155.3333282470703)
    ],
    style: null
  }
]

export default (state = defaultState, action) => {
  switch (action.type) {
    default:
      return state
  }
}

export const getDocumentById = (id, state) => state

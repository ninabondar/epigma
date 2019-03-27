import { MOVE_VERTEX } from "./actionTypes"

const moveVertex = (x, y) => ({
  type: MOVE_VERTEX,
  point: {x:x, y:y}
})

export default moveVertex()

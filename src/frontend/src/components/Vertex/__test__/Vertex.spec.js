import React from "react"
import { createPoint } from "../../../utils/helper"
import Vertex from "../Vertex"

describe("<Vertex />", () => {
  const point = createPoint({ x: 0, y: 0 })
  
  it("smoke test component", () => {
    shallow(<Vertex point={point}/>)
  })
})

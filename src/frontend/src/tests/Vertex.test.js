import React from "react"
import { createPoint } from "../utils/helper"
import Vertex from "../components/Vertex"

describe("<Vertex/>", () => {
  const point = createPoint({ x: 0, y: 0 })

  it("should match its snapshot", () => {
    const component = shallow(<Vertex point={point}/>)
    expect(component).toMatchSnapshot()
  })
})
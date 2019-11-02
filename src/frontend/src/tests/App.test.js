import React from "react"
import App from "../components/App"

describe("<App/>", () => {
  test("should match its snapshot", () => {
    const component = shallow(<App />)
    expect(component).toMatchSnapshot()
  })
})

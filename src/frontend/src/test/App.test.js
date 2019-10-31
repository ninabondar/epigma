import React from "react"
import { shallow } from "enzyme"
import App from "../components/App"
import toJson from "enzyme-to-json"

describe("<App/>", () => {
  test("smoke test of the component", () => {
    shallow(<App />)
  })
  test("matches the snapshot", () => {
    const tree = shallow(<App />)
    expect(toJson(tree)).toMatchSnapshot()
  })
})
